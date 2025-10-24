import { useEffect, useState } from "react";
import HeaderBar from "../../components/HeaderBar";
import SidebarMenu from "../../components/SidebarMenu";
import ListingCard from "../../components/ListingCard";
// import { properties } from "../data/propertyData";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookies";
import propertyClient from "../../utils/propertyClient";
import { Listing } from "./Home";

export default function TelaPropriedades() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [properties, setProperties] = useState<Listing[]>([])
  const navigate = useNavigate();

   useEffect(() => {
        const token = getCookie('token')
        if(!token) navigate('/login')

        const fetchProperties = async () => {
          try {

            const response = await propertyClient.get(`/property/${token}`)

            

            const propertiesResponse = Object.values(response.data.userProperties.properties)

            setProperties(propertiesResponse as Listing[])

          } catch (err) {
             console.error("Erro ao carregar todas as salas:", err);
          }
        }

        fetchProperties()

      }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light to-gray-100">
      <SidebarMenu active={sidebarActive} onClose={() => setSidebarActive(false)} />
      <HeaderBar onMenuClick={() => setSidebarActive(!sidebarActive)} />
      <main className="mt-20 p-10 w-full min-h-[calc(100vh-80px)] flex justify-center">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center">
          <h1 className="text-4xl text-secondary mb-10 font-bold text-center">
            Suas Propriedades
          </h1>
          <section className="w-full mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-grow h-px bg-gradient-to-r from-[#34495e] via-blue-400 to-transparent"></div>
              <h2 className="text-2xl font-semibold text-[#34495e] whitespace-nowrap">
                Propriedades Ativas
              </h2>
              <div className="flex-grow h-px bg-gradient-to-l from-[#34495e] via-blue-400 to-transparent"></div>
            </div>
            {properties.length === 0 ? (
              <p className="text-gray-500 text-center">Nenhuma propriedade ativa no momento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {properties.map((property) => (
                  <ListingCard key={property.id} listing={property} />
                ))}
              </div>
            )}
          </section>

            {/**
             * @todo: colocar propriedades antigas ?
            */}

          {/* <div className="flex items-center gap-4 my-8 w-full">
            <div className="flex-grow h-0.5 bg-gradient-to-r from-gray-300 via-[#34495e] to-transparent"></div>
            <span className="text-lg font-semibold text-gray-500">Histórico</span>
            <div className="flex-grow h-0.5 bg-gradient-to-l from-gray-300 via-[#34495e] to-transparent"></div>
          </div> */}

          
          {/* <section className="w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-grow h-px bg-gradient-to-r from-gray-400 via-gray-300 to-transparent"></div>
              <h2 className="text-2xl font-semibold text-gray-500 whitespace-nowrap">
                Propriedades Antigas
              </h2>
              <div className="flex-grow h-px bg-gradient-to-l from-gray-400 via-gray-300 to-transparent"></div>
            </div>
            {pastProperties.length === 0 ? (
              <p className="text-gray-400 text-center">Nenhuma propriedade antiga encontrada.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {pastProperties.map((property) => (
                  <ListingCard key={property.id} listing={propertyToListing(property)} />
                ))}
              </div>
            )}
          </section> */}
        </div>
      </main>
    </div>
  );
}