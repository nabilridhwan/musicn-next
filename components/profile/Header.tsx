export default function Header({title, lead}: {title: string; lead: string}) {
  return (
    <div className={'my-10'}>
      <h1>{title}</h1>
      <p>{lead}</p>
    </div>
  );
}
