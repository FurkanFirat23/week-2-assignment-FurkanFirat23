renderHeader();

const todosUrl = "https://jsonplaceholder.typicode.com/todos";
const root = document.querySelector("#root");
const editModal = document.querySelector("#editModal");
let todos = [];
let todo;

// sayfa sayısı
let current_page = 1;

//her sayfada ne kadar satır bulunacağı
let rows = 15;

const renderTodos = (page = 1) => {
  //page = 1 -> default olarak 1. sayfada olması için varsayılan değer.
  root.innerHTML = "";
  // todoları listele
  const table = document.createElement("table");
  table.setAttribute("class", "table table-hover");

  const thead = document.createElement("thead");

  // sıralama yapmak için title-sorting id' si tanımlandı. Butonada verilebilir.
  thead.innerHTML = `
    <tr>
      <th scope="col" id="id-sorting">id<button class="id-reverse">&darr;</button></th>
      <th scope="col" id="title-sorting">Başlık <button >&darr;</button></th>
      <th scope="col" id="userid-sorting">Kullanıcı Id</th>
      <th scope="col">Durum</th>
      <th scope="col"></th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  const renderItem = (item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.title}</td>
      <td>${item.userId}</td>
      <td>${item.completed ? "Tamamlandı" : "Yapılacak"}</td>
      <td>
        <button class="btn btn-xs btn-danger remove" data-id=${
          item.id
        }>Sil</button>
        <button class="btn btn-xs btn-warning edit" data-id=${
          item.id
        }>Düzenle</button>
      </td>
    `;
    tbody.appendChild(tr);
  };

  // şu anki sayfanın 1 eksiği örneği 1. sayfaysa 0
  page--;

  // 10*0 = 0;
  let start = rows * page;
  console.log({ start });
  let end = start + rows;
  // 0 + 10 = 10;
  console.log({ end });
  // 0. index ve 10.index arası gösterilecek.
  // hangi seçili sayfadaysak ona göre render ediliyor.
  let paginatedItems = todos.slice(start, end);
  paginatedItems.forEach((item) => {
    renderItem(item);
  });
  table.appendChild(tbody);
  root.append(table);

  document.querySelectorAll(".remove").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.getAttribute("data-id"));
      if (confirm("kaydı silmek istediğinize emin misiniz?")) {
        todos = todos.filter((x) => x.id !== id);
        // aynı sayfada kalması için current_page parametresi eklendi.
        renderTodos(current_page);
      }
    });
  });

  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.getAttribute("data-id"));
      todo = todos.find((todo) => todo.id == id);
      editModal.querySelector("#title").value = todo.title;
      editModal.querySelector("#completed").checked = todo.completed;
      editModal.style.display = "block";
      editModal.classList.add("show");
    });
  });

  document.querySelector("#title-sorting").addEventListener("click", () => {
    // başlığa tıklandığında sıralama yapılacak.
    todos.sort((a, b) => {
      // küçük ve büyük harf farkını engellemek için
      const nameA = a.title.toUpperCase(); // ignore upper and lowercase
      const nameB = b.title.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    // sıralama yapılacak tekrar o sayfada render edilecek.
    renderTodos(current_page);
  });
  document.querySelector("#id-sorting").addEventListener("click", () => {
    // id tıklandığında sıralama yapılacak.
    todos.sort((a, b) => a.id - b.id);
    // sıralama yapılacak tekrar o sayfada render edilecek.
    renderTodos(current_page);
  });
  document.querySelector(".id-reverse").addEventListener("click", () => {
    // id tıklandığında sıralama yapılacak.
    todos.sort((a, b) => a.id - b.id);

    // sıralama yapılacak tekrar o sayfada render edilecek.
    renderTodos(current_page);
  });

  document.querySelector("#userid-sorting").addEventListener("click", () => {
    // userid tıklandığında sıralama yapılacak.
    todos.sort((a, b) => a.userId - b.userId);
    renderTodos(current_page);
  });

  document.querySelectorAll(".page-link").forEach((btn) => {
    // pagination butonları içinde döndürülerek, her elemente click eklendi, tıklandığında kaçıncı sayfadaysa oraya göre render edilecek.
    btn.addEventListener("click", () => {
      let data_id = btn.getAttribute("data-id");
      // kaçıncı buton olduğu attribute olarak alında.
      current_page = Number(data_id);
      renderTodos(current_page);
    });
  });
};

editModal.querySelector("#save").addEventListener("click", () => {
  todo.title = editModal.querySelector("#title").value;
  todo.completed = editModal.querySelector("#completed").checked;
  const index = todos.findIndex((t) => t.id == todo.id);
  todos[index] = todo;
  renderTodos();
  editModal.style.display = "none";
  editModal.classList.remove("show");
});

editModal.querySelectorAll(".close").forEach((button) => {
  button.addEventListener("click", () => {
    editModal.style.display = "none";
    editModal.classList.remove("show");
  });
});

fetch(todosUrl)
  .then((resp) => resp.json())
  .then((data = []) => {
    todos = data;
    renderTodos();
  })
  .catch((error) => {
    errorLogger(error);
  });

// sıralama ödevi algoritması
// table thead kısmındaki sıralama yapılacak kolonlara event listener eklenecek.
// event listener hangi kolon için tıklanıyorsa
// sort metodu kullanılarak sıralama yapılacak
// sıralanmış todos'todus içerisine atılacak
// renderTodos metodu çalıştırılacak.
