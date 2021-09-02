import { useState, useEffect } from "react";
import { ChevronRight, Download } from "react-feather";
import { jsonCategories } from "./data";
import { useLocation } from "react-router-dom";
import "./styles.css";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Home = () => {
  const [items, setItems] = useState(jsonCategories);

  let query = useQuery();

  const queryParams = query.get("path");

  const idChild = queryParams && queryParams.split("/");

  let category = null;

  useEffect(() => {
    if (idChild?.length) {
      for (const child in idChild) {
        if (child === "0") {
          console.log("0");
          continue;
        }

        if (child === "1") {
          console.log("base");
          category = items.find(item => item.id === idChild[child]);
          continue;
        }

        category = category.children.find(item => item.id === idChild[child]);
      }
      setItems(category.children);
      console.log(category);
    }
  }, []);

  const filterList = event => {
    var updatedList = jsonCategories;

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

  return (
    <main>
      <header className="top-nav">
        <img src="aws-branco.png" alt="Categorias amazon" />
        Amazon - Listagem de Categorias
      </header>

      <div className="container">
        <div className="filter-list">
          <input type="text" placeholder="Categoria" onChange={filterList} />
          {/* <nav aria-label="You are here:" role="navigation">
            <ul class="breadcrumbs">
              <li>
                <a href="/">MODA</a>
              </li>
              <li>
                <a href="/">FEMININO</a>
              </li>
              <li class="disabled">JOIAS</li>
            </ul>
          </nav> */}
          <ul>
            {items &&
              items.map(item => {
                return (
                  <li key={item.id} className="list-items">
                    {item.isSellable ? (
                      <div className="next-category">
                        <section>
                          <div className="parent-title">{item.label}</div>
                          <small>
                            BrowseNodeId: {item.id}
                            {/* {`${item.isRoot && item.productType}`} */}
                          </small>
                          {/* <div className="child-list">
                            <nav aria-label="You are here:" role="navigation">
                            <ul class="breadcrumbs">
                                {item.browsePath.map(child => {
                                return (
                                    <li key={child.id}>
                                    <a href="/">{child.name.toLowerCase()}</a>
                                    </li>
                                );
                                })}
                            </ul>
                            </nav>
                        </div> */}
                        </section>
                      </div>
                    ) : (
                      <a
                        href={`?path=${item.browsePath}/${item.id}`}
                        className="next-category"
                      >
                        <section>
                          <div className="parent-title">{item.label}</div>
                          <small>
                            BrowseNodeId: {item.id}
                            {/* {`${item.isRoot && item.productType}`} */}
                          </small>
                          {/* <div className="child-list">
                    <nav aria-label="You are here:" role="navigation">
                      <ul class="breadcrumbs">
                        {item.browsePath.map(child => {
                          return (
                            <li key={child.id}>
                              <a href="/">{child.name.toLowerCase()}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div> */}
                        </section>
                      </a>
                    )}
                    {!item.isSellable ? (
                      <ChevronRight />
                    ) : (
                      <a href={items?.url}>
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
