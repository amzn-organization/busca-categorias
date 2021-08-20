import { useState } from "react";
import { ChevronRight } from "react-feather";
import "./App.css";

function App() {
  const BRACELET = [
    {
      browseNodeName: "Pulseiras",
      browsePath: [
        { id: "17365812011", name: "Moda" },
        { id: "17681969011", name: "Feminino" },
        { id: "17681991011", name: "Joias" },
        { id: "17682104011", name: "Pulseiras" },
      ],
      productType: "BRACELET",
    },
    {
      browseNodeName: "Tornozeleiras",
      browsePath: [
        { id: "17365812011", name: "Moda" },
        { id: "17681969011", name: "Feminino" },
        { id: "17681991011", name: "Joias" },
        { id: "17682106011", name: "Tornozeleiras" },
      ],
      productType: "BRACELET",
    },
  ];

  const [items, setItems] = useState(BRACELET);

  const filterList = event => {
    var updatedList = BRACELET;

    updatedList = updatedList.filter(function (item) {
      return (
        item.browseNodeName
          .toLowerCase()
          .search(event.target.value.toLowerCase()) !== -1
      );
    });

    setItems(updatedList);
    console.log(updatedList);
  };

  return (
    <div className="container">
      <div className="filter-list">
        <input type="text" placeholder="Categoria" onChange={filterList} />
        <nav aria-label="You are here:" role="navigation">
          <ul class="breadcrumbs">
            <li>
              <a href="/">Bebês</a>
            </li>
            <li>
              <a href="/">Segurança</a>
            </li>
            <li class="disabled">Outros (Segurança)</li>
          </ul>
        </nav>
        <ul>
          {items.map(item => {
            return (
              <li key={item} className="list-items">
                <div className="parent-title">
                  {item.browseNodeName}
                  <ChevronRight />
                </div>
                <div className="child-list">
                  {item.browsePath.map((child, index) => {
                    return (
                      <div key={child.id}>
                        {child.name.toLowerCase()}
                        {item.browsePath.length - 1 > index && '/'}
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
