import Card from "./components/Card";

export default function Home() {
  return (
    <div className="my-5 grid justify-items-center gap-4 md:gap-6 md:grid-cols-3">
      <Card Title="Intenção" PagePath="/intention" />
    </div>
  );
}
