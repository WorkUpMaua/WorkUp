import React from "react";
import Logo from "../assets/logo_WorkUp.png";
import IconNotificacao from "../assets/icon_notificacao.png";
import RoomCard from "../components/RoomCard";

type CatalogStates = {
  sidebarActive: boolean;
  roomsMock: roomsType[];
  filteredRooms: roomsType[];
};

type roomsType = {
  imgPath: string;
  name: string;
};

export default class Catalog extends React.Component {
  state: CatalogStates = {
    sidebarActive: false,
    roomsMock: [
      {
        imgPath:
          "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg",
        name: "Escritório 1",
      },
      {
        imgPath:
          "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
        name: "Escritório 2",
      },
      {
        imgPath:
          "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg",
        name: "Escritório 3",
      },
      {
        imgPath:
          "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
        name: "Escritório 4",
      },
    ],
    filteredRooms: []
  };

  toggleSidebar = () =>
    this.setState({ sidebarActive: !this.state.sidebarActive });

  render() {
    return (
      <div className="w-full overflow-x-hidden relative">
        <header className="w-full bg-[#34495e] text-white flex items-center justify-between px-6 py-2 z-[1001] shadow-md">
          <button
            onClick={this.toggleSidebar}
            className="w-14 h-14 flex items-center justify-center border-2 border-gray-300 rounded-xl shadow-inner hover:bg-[#2c3e50] cursor-pointer"
          >
            &#9776;
          </button>

          <div className="flex flex-col items-center">
            <img src={Logo} alt="WorkUp Logo" className="h-16" />
          </div>

          <div className="flex items-center space-x-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Usuário"
              className="w-10 h-10 cursor-pointer"
            />
          </div>
        </header>

        <div
          className={`fixed top-20 left-0 h-[calc(100%-4rem)] w-64 bg-[#2c3e50] text-white transform transition-transform duration-300 ease-in z-40 ${
            this.state.sidebarActive ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Menu</h2>
            <ul className="space-y-2">
              <li>Dashboard</li>
              <li>Usuário</li>
              <li>Configurações</li>
              <li>Sair</li>
            </ul>
          </div>
        </div>

        <main className="w-full flex flex-col justify-center items-center pt-16 p-4">
          <div className="grid grid-cols-4 gap-5">
            {this.state.roomsMock &&
              this.state.roomsMock.map((room) => (
                <RoomCard imgPath={room.imgPath} name={room.name} />
              ))}
          </div>
        </main>
      </div>
    );
  }
}
