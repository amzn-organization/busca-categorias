# Busca de categorias - Amazon

Neste repositório você encontrará uma API para gerar arquivos JSON de categorias e prover endpoints
para consulta das mesmas e exemplos de aplicações frontend para utilizar os endpoints.

# Setup

Ao clonar o repositório, entre no diretório `Backend/Node` e use o comando `yarn start`.
Feito isso, entre no diretório `Frontend/Vuejs` e use o comando `npm run serve`.

## Backend: Overview

No backend você encontra o arquivo `index.js`, responsável por gerar o JSON
contendo as categorias de forma aninhada. Para que o JSON de categorias seja gerado,
é necessário um `report.json` que pode ser obtido através do `Seller Central` da Amazon.

O `index.js` usa os dados do `report.json` para gerar um novo arquivo JSON de categorias contendo
as informações principais das mesmas e de forma aninhada, ou seja, suas categorias filhas ficam
dentro da propriedade `children`. Ele também utiliza o arquivo `xsd-reference.js` para incluir
os arquivos `XSD` da categoria baseado no `browseNodeId`.

Exemplo de uma categoria:

```
{
  "id": "16770134011",
  "name": "Amplificadores de Audição",
  "pathById": "16215417011,16215418011,18364160011,16769535011,16770134011",
  "pathByName": "Saúde,Acessibilidade e Vida Prática,Aparelhos Auditivos e Acessórios,Amplificadores de Audição",
  "productType": "HEALTH_PERSONAL_CARE",
  "hasChildren": false,
  "documents": [
    "https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_4_1/Health.xsd",
    "https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_4_1/ProfessionalHealthCare.xsd"
  ],
  "children": []
}
```

O arquivo `server.js` disponibiliza endpoints utilizando `Express` para consultas que utilizam
como dados de resposta o JSON gerado.

## Frontend: Overview

O frontend simula a tela de [Adicionar um produto não existente](https://sellercentral.amazon.com/productclassify?ref_=xx_catadd_dnav_xx)
da Amazon. Dessa forma, ele exibe as categorias e o usuário pode clicar numa categorias expecífica para ver
os filhos dela e por fim, acessar o arquivo `XSD` da mesma.

# Backend e Frontend: Passo a passo

### Glossário (Browse tree node ID, Path, Categoria, Product type, XSD......)

| Termo            | Significado                                                  |
| ---------------- | ------------------------------------------------------------ |
| browseNodeId     | ID da categoria                                              |
| browsePathById   | Caminho por ID de uma categoria                              |
| browsePathByName | Caminho por nome de uma categoria                            |
| productType      | Tipo de produto relacionado a uma categoria                  |
| XSD de Categoria | Arquivo XSD contendo informações de uma categoria específica |
| Categoria Base   | Categorias cujo `browsePathById` tenham um ID ou menos       |

### Passo 2 - Gerar novo formato JSON através do relatório

Com base no report gerado, um novo JSON deve ser gerado contendo as informações cruciais de cada categoria e aninhando as mesmas.

- O conteúdo do report.json deve ser lido e salvo em uma variável do tipo array.
- Um novo array em branco deve ser criado.
- O array com o com o conteúdo do report deve ser percorrido, para cada categoria, um objecto com os dados: browseNodeId, browseNodeName, browsePathById, browsePathByName, childNodes e productTypeDefinitions
  deve ser criado e adicionado no array em branco criado anteriormente.

Após esse processo teremos as categorias montadas, porém os childNodes dela serão numéricos, para resolver isso, precisamos percorrer o novo array de categorias.

- Para cada categoria, o childNodes deve ser percorrido.
- Para cada childNode, deve-se remover o childNode numérico e colocar em seu lugar o a categoria em si. Exemplo em Javascript:

```
for (const childID of childrenIDs) {
    const child = preparedCategories.find((c) => c.id === childID);

    if (!child) {
      console.log(
        `Child ${childID} not found on report data for ${category.id}`.red
      );
      continue;
    }

    category.children.push(child);
}
```

Por fim, todas as categorias que não sejam categorias base, devem ser removidas da raiz do array.
Exemplo em JavaScript:

```
// As categorias que tenham apenas dois IDs em pathById são as categorias base.
const finalCategories = preparedCategories.filter(
  (c) => c.pathById.split(",").length <= 2
);
```

Agora o array de categorias terá todas as categorias e suas categorias filhos geradas, de forma aninhada.

### Passo 3 - Associar os XSDs corretos para as categorias

Para associar o arquivo XML/XSD correto para as categorias, é preciso criar um novo arquivo exportando um objeto
que terá em seu índice o browseNodeID da categoria base e como valor um array de XSDs relacionados.
Exemplo:

```
export const xsds = {

  // Categoria: Automotivo
  18914210011: [
    "https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_4_1/AutoAccessory.xsd",
    "https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_4_1/LightMotor.xsd",
    "https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_1_9/Motorcycles.xsd",
    "https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_1_9/PowerTransmission.xsd",
  ],

  // Categoria: Bebês
  17242604011: [
    "https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_4_1/Baby.xsd",
    "https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_4_1/Beauty.xsd",
    "https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_4_1/ToysBaby.xsd",
  ],

  // ...
}
```

No primeiro `for` do `Passo 2`, você deve verificar se o objeto de XSDs exportado contém algum browsePathById da categoria que está sendo percorrida.
Caso esse ID exista, você pode atribuir os XSDs a essa categoria.
Exemplo em JavaScript:

```
import { xsds } from "./xsd-reference.js";

// Esse trecho de código deve ficar dentro do primeiro "for" do Passo 2.
const splittedPathByID = pathById.split(",");
const categoryXSDs = [];

for (const pathID of splittedPathByID) {
    if (!xsds[pathID]) {
      continue;
    }

    categoryXSDs.push(...xsds[pathID]);
}
```

### Passo 4 - Criar os endpoints para disponibilizar as categorias (3 endpoints)

Nessa etapa, deve ser criado 3 endpoints: `getCategories`, `getCategory` e `getCategoryByPath`.
Os dados utilizados nesses endpoints serão os dados do novo JSON de categorias gerado nos passos anteriores.

- `getCategories`: retorna todas as categorias.
- `getCategory`: retorna uma categoria por `ID` ou `nome`.
- `getCategoryByPath`: retorna uma categoria pelo `browsePathById`
