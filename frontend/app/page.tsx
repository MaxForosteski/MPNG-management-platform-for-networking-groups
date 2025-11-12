import Card from "./components/Card";

export default function Home() {
  return (
    <div>
      <div className="bg-neutral-200 text-black top-0 w-[100vw] p-6 flex justify-end mb-5">
        <button className="bg-blue-600 text-white p-3 rounded font-semibold">Área Admin</button>
      </div>
      <div className="my-5 grid justify-items-center gap-4 md:gap-6 md:grid-cols-3">
        <Card Title="Intenção" PagePath="/intention" />
      </div>
    </div>

  );
}
