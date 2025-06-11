import { useState, useEffect } from "react";

type Todo = {
  text: string;
  category: string;
};

function App() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("仕事");
  const [todos, setTodos] = useState<Todo[]>([]);

  // ローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error("読み込み失敗:", e);
      }
    }
  }, []);

  // ローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    if (!task.trim()) return;
    setTodos([...todos, { text: task, category }]);
    setTask("");
  };

  const removeTask = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>カテゴリ付きToDoリスト</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="仕事">仕事</option>
          <option value="趣味">趣味</option>
          <option value="家事">家事</option>
          <option value="その他">その他</option>
        </select>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="やることを入力"
        />
        <button onClick={addTask}>追加</button>
      </div>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            [{todo.category}] {todo.text}{" "}
            <button onClick={() => removeTask(i)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;