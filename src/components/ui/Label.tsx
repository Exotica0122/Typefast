type LabelProps<T> = {
  title: string;
  value?: T;
};

export const Label = ({ title, value }: LabelProps<string | number>) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl text-neutral-400">{title}</h2>
      <p className="text-4xl text-yellow-300">{value}</p>
    </div>
  );
};
