type Props = {
  title: string;
  id: string;
};

export const SedoErrorMessage = ({ title, id }: Props) => {
  return (
    <div>
      {title} {id}
    </div>
  );
};
