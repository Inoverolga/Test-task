import AppTable from "../appTable/AppTable";
import Header from "../header/Header";
import AppModal from "../modal/modal";

import "./App.scss";

const App = () => {
  return (
    <div className="app">
      <div className="app__content">
        <Header />
        <AppModal />
        <AppTable />
      </div>
    </div>
  );
};

export default App;
