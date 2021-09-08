import 'colors';
import { config } from './config.js';
import { readFile, saveJSONToFile } from './helpers.js';

const reportData = readFile(config.reportFileName).Result.Node;
const preparedCategories = [];

console.log(`Mounting categories based on report file...`.yellow)
for (const category of reportData) {
  const id = category.browseNodeId;
  const name = category.browseNodeName;
  const pathById = category.browsePathById;
  const pathByName = category.browsePathByName;
  const hasChildren = category.childNodes['@count'] > 0;
  let children = category.childNodes['@count'] > 0 ? category.childNodes.id : [];
  const productType = category.productTypeDefinitions;

  // Preventing string children
  if (typeof children === "string") {
    children = [children]
  }

  preparedCategories.push({
    id,
    browsePath: pathById.split(',').join('/'),
    isSellable: !hasChildren,
    displayPath: pathByName.split(',').join('/'),
    label: name,
    itemType: productType,
    numberOfAuthorizedChildren: children.length,
    recommendedBrowseNode: id,
    childrenIDs: children,
  });
}

console.log(`Mounting children of ${preparedCategories.length} categories...`.yellow);
for (const category of preparedCategories) {
  const childrenIDs = [...category.childrenIDs];
  delete category.childrenIDs
  category.children = {};

  for (const childID of childrenIDs) {
    const child = preparedCategories.find(c => c.id === childID);
    
    if (!child) {
      console.log(`Child ${childID} not found on report data for ${category.id}`.red);
      continue;
    }

    category.children[childID] = child;
  }
}

console.log(`Removing children categories from root of the array`.yellow);
const finalCategories = preparedCategories.filter(c => c.browsePath.split('/').length <= 2);

console.log(`Converting categories array to indexed object`.yellow);
const objectCategories = {};

const saveOnly = ['Alimentos e Bebidas', 'Automotivo', 'Bebês', 'Beleza', 'Brinquedos e Jogos']
for (const category of finalCategories) {
  category.isBaseCategory = true;

  if (saveOnly.length) {
    if (saveOnly.includes(category.label)) {
      objectCategories[category.id] = category;
    }
  } else {
    objectCategories[category.id] = category;
  }
}

console.log(`Saving ${preparedCategories.length} categories`.cyan);
saveJSONToFile(objectCategories, `${config.fileName}-object.json`);

console.log('Categories saved successfully'.green)