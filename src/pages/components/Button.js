export default function Button(props) {
  const {
    title,
    onClick,
    width = 'auto',
    bgColor = 'white',
    textColor = 'black',
    borderColor = 'gray-400',
    isDisabled = false,
  } = props;

  if (width !== 'auto' && width !== 'fixed') {
    console.error('Buttons are only fixed or auto width');
    return null;
  }

  return (
    <button
      onClick={!isDisabled ? onClick : null}
      className={`${width === 'fixed' ? 'w-7 h-7' : 'px-9 py-2 text-xs'} ${
        isDisabled
          ? 'bg-gray-300 border-white'
          : `cursor-pointer bg-${bgColor} border-gray-400`
      } font-semibold rounded-full text-${textColor} border border-${borderColor} inline-block self-center text-center`}
    >
      {title?.length <= 1 ? <p className="mt-[-2px]">{title}</p> : title}
    </button>
  );
}
