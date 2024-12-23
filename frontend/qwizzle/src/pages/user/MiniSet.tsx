type Props = {
  title: string;
  from?: string;
  to?: string;
  bgColor?: string;
};

export default function MiniSet({ title, from, to, bgColor }: Props) {
  return (
    <div
      className={`w-10/12 rounded-md border-2 border-solid border-white bg-${bgColor} px-3 py-2 text-center text-white hover:bg-primary_hover md:flex md:justify-between`}
    >
      <div className="text-2xl font-extrabold md:text-4xl">{title}</div>
      <div className="md:my-auto md:text-3xl">
        <span className="mr-2 font-bold">{from}</span>➡
        <span className="ml-2 font-bold">{to}</span>
      </div>
    </div>
  );
}
