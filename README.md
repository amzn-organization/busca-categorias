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
os arquivos `XSD` da categoria baseado no `browseNodeId` das mesmas.

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
