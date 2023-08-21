export default function Button(props) {
  const {
    title,
    onClick,
    width = 'auto',
    bgColor = 'white',
    textColor = 'black',
    borderColor = 'gray-400',
  } = props;

  if (width !== 'auto' && width !== 'fixed') {
    console.error('Buttons are only fixed or auto width');
    return null;
  }
  
  return (
    <div
      onClick={onClick}
      className={`${
        width === 'fixed' ? 'w-7 h-7' : 'px-9 py-2 text-xs'
      } font-semibold cursor-pointer rounded-full bg-${bgColor} text-${textColor} border border-${borderColor} inline-block self-center text-center`}
    >
      {title}
    </div>
  );
}
