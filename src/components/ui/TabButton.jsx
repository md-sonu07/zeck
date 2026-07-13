import Button from './Button';

const TabButton = ({ active, ...props }) => (
    <Button variant={active ? 'primary' : 'outline'} {...props} />
);

export default TabButton;
