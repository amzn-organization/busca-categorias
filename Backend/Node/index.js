require("colors");
const { config } = require("./config.js");
const { readFile, saveJSONToFile } = require("./helpers.js");
const { xsds } = require("./xsd-reference.js");

const reportData = readFile(config.reportFileName).Result.Node;
const preparedCategories = [];

console.log(`Mounting categories based on report file...`.yellow);
for (const category of reportData) {
  const id = category.browseNodeId;
  const name = category.browseNodeName;
  const pathById = category.browsePathById;
  const pathByName = category.browsePathByName;
  const hasChildren = category.childNodes["@count"] > 0;
  const productType = category.productTypeDefinitions;

  let children =
    category.childNodes["@count"] > 0 ? category.childNodes.id : [];

  // Preventing string children
  if (typeof children === "string") {
    children = [children];
  }

  const splittedPathByID = pathById.split(",");
  const categoryXSDs = [];

  for (const pathID of splittedPathByID) {
    if (!xsds[pathID]) {
      continue;
    }

    categoryXSDs.push(...xsds[pathID]);
  }

  preparedCategories.push({
    id,
    name,
    pathById,
    pathByName,
    productType,
    hasChildren,
    documents: categoryXSDs,
    children,
  });
}

saveJSONToFile(preparedCategories, `categories/${config.fileName}-root.json`);

console.log(
  `Mounting children of ${preparedCategories.length} categories...`.yellow
);
for (const category of preparedCategories) {
  const childrenIDs = [...category.children];
  category.children = [];

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
}

saveJSONToFile(
  preparedCategories,
  `categories/${config.fileName}-root-with-children.json`
);

console.log(`Removing children categories from root of the array`.yellow);
const finalCategories = preparedCategories.filter(
  (c) => c.pathById.split(",").length <= 2
);

console.log(
  `Saving ${finalCategories.length} (${
    preparedCategories.length - finalCategories.length
  } w/ children) categories`.cyan
);
saveJSONToFile(finalCategories, `categories/${config.fileName}.json`);

console.log("Categories saved successfully".green);
