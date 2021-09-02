import { useState, useEffect } from "react";
import { ChevronRight, Download } from "react-feather";
import { jsonCategories } from "./data";
import { useLocation } from "react-router-dom";
import "./styles.css";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const getAsArray = (data, isBaseCategory) => {
  if (isBaseCategory) {
    const arr = [];

    for (const index of Object.keys(data.children)) {
      arr.push(data.children[index]);
    }

    data.children = [...arr];
    return data;
  }

  const arr = [];

  for (const index of Object.keys(data)) {
    arr.push(data[index]);
  }

  data = [...arr];
  return data;
};

const Home = () => {
  const [items, setItems] = useState(getAsArray(jsonCategories));

  let query = useQuery();

  const queryParams = query.get("path");

  const idChild = queryParams && queryParams.split("/");

  let category = null;

  useEffect(() => {
    if (idChild?.length) {
      for (const child in idChild) {
        if (child === "0") {
          continue;
        }

        if (child === "1") {
          category = items.find(item => item.id === idChild[child]);

          // console.log("category", category);
          // console.log("browsePath", {
          //   url: `${category.browsePath}/${category.id}`,
          // });
          // console.log("label", category.label);

          continue;
        }

        category = getAsArray(category.children).find(
          item => item.id === idChild[child]
        );
      }
      setItems(getAsArray(category.children));
    }
  }, []);

  const filterList = event => {
    var updatedList = getAsArray(jsonCategories);

    updatedList = updatedList.filter(function (item) {
      return (
        item.label.toLowerCase().search(event.target.value.toLowerCase()) !==
          -1 ||
        item.productType
          .toLowerCase()
          .search(event.target.value.toLowerCase()) !== -1 ||
        item.id.search(event.target.value.toLowerCase()) !== -1
      );
    });

    setItems(updatedList);
  };

  // const getDisplayPath = useCallback(array => {
  //   return (
  //     array &&
  //     array.map(({ label, children }) =>
  //       Object.assign(
  //         { label },
  //         children && { children: getDisplayPath(children) }
  //       )
  //     )
  //   );
  // }, []);

  // useEffect(() => {
  //   setChild(getDisplayPath(items));
  // }, []);

  // const getBread = cat => {
  //   console.log("cat", cat);

  //   const browsePathSplited = cat.browsePath.split("/");
  //   const displayPathSplited = cat.displayPath.split("/");
  //   const bc = [];

  //   let stringified = "";
  //   let path = "";

  //   for (const i in displayPathSplited) {
  //     if (browsePathSplited.length === 2) {
  //       path = browsePathSplited.join("/");
  //     }

  //     stringified += `${browsePathSplited[i]}/`;

  //     bc.push({
  //       id:
  //         i > 0
  //           ? `${browsePathSplited[i]}`
  //           : `${browsePathSplited[i]}/${browsePathSplited[2]}`,
  //       label: displayPathSplited[i],
  //       fullPath: path ? path : stringified,
  //     });

  //     if (browsePathSplited.length !== 2) {
  //       const currentIndex = bc.length - 1;
  //       bc[currentIndex].fullPath = bc[currentIndex].fullPath.slice(0, -1);
  //     }
  //   }
  //   console.log("stringified", stringified);
  //   console.log("browsePathSplited", browsePathSplited);
  //   console.log("displayPathSplited", displayPathSplited);

  //   return bc;
  // };

  const getBread = cat => {
    const browsePathSplited = cat.browsePath.split("/");
    const displayPathSplited = cat.displayPath.split("/");

    const bc = [];

    for (const i in browsePathSplited) {
      let index = Number(i);

      if (index > 0) {
        bc.push({
          id: browsePathSplited[index],
          label: displayPathSplited[index],
          fullPath: `${cat.browsePath
            .split("/")
            .slice(0, index + 1)
            .join("/")}/${browsePathSplited[index + 1]}`,
          isDisabled: browsePathSplited.length === index + 2,
        });
      } else {
        bc.push({
          id: `${browsePathSplited[index]}/${browsePathSplited[index + 1]}`,
          label: displayPathSplited[index],
          fullPath: `${browsePathSplited[index]}/${
            browsePathSplited[index + 1]
          }`,
          isDisabled: browsePathSplited.length === index + 2,
        });
      }
    }

    return bc.slice(0, -1);
  };

  return (
    <main>
      <header className="top-nav">
        <figure>
          <img src="aws-branco.png" alt="Categorias amazon" />
          Amazon - Listagem de Categorias
        </figure>
        <input type="text" placeholder="Categoria" onChange={filterList} />
      </header>

      <div className="container">
        <div className="filter-list">
          <nav aria-label="You are here:" role="navigation">
            <ul className="breadcrumbs">
              <li>
                <a href="/">Categorias</a>
              </li>
              {getBread(getAsArray(items)[0]).map(bread => (
                <li
                  key={bread.id}
                  className={bread.isDisabled ? "disabled" : ""}
                >
                  {bread.isDisabled ? (
                    bread.label
                  ) : (
                    <a href={`http://localhost:3000/?path=${bread.fullPath}`}>
                      {bread.label}
                    </a>
                  )}
                </li>
              ))}
              {/* <li className="disabled">
                Alimentos Enlatados, em Conserva e em Pacotes
              </li> */}
            </ul>
          </nav>
          <ul>
            {items &&
              getAsArray(items).map(item => {
                return (
                  <li key={item.id} className="list-items">
                    {item.isSellable ? (
                      <div className="next-category">
                        <section>
                          <div className="parent-title">{item.label}</div>
                          <small>BrowseNodeId: {item.id}</small>
                        </section>
                      </div>
                    ) : (
                      <a
                        href={`?path=${item.browsePath}/${item.id}`}
                        className="next-category"
                      >
                        <section>
                          <div className="parent-title">{item.label}</div>
                          <small>BrowseNodeId: {item.id}</small>
                        </section>
                      </a>
                    )}
                    {!item.isSellable ? (
                      <ChevronRight stroke="#f08804" />
                    ) : (
                      <a
                        href={item?.url}
                        target="_blank"
                        rel="noreferrer"
                        download
                      >
                        <Download />
                      </a>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Home;
