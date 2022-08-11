function App() {
  fetch('http://localhost:3001/auth')
  .then(response => response.text())
  .then(data => console.log({data}));

  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}

export default App;
