import { Dialog, DialogTitle } from '@example/shared';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const PayAccountModal = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Оплата подписки</DialogTitle>
    </Dialog>
  );
};
