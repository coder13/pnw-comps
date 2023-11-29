import { Header } from "../Header/Header";
import { Competitions } from "../containers/Competitions";

export default function Home() {
  return (
    <div className="p-2 flex flex-col w-full h-full">
      <Header />
      <hr />
      <main className="w-full h-full flex flex-col">
        <Competitions />
      </main>
    </div>
  );
}
