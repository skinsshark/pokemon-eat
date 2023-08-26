export default function Button(props) {
  const {
    title,
    onClick,
    size = 'regular',
    bgColor = 'white',
    textColor = 'black',
    borderColor = 'gray-400',
    isDisabled = false,
  } = props;

  if (size !== 'small' && size !== 'regular') {
    console.error('Buttons are only small or regular sized');
    return null;
  }

  const isSmallButton = size === 'small';

  // width/height + shadow styles
  let sizeStyles = 'px-9 py-2 text-xs shadow-float'; // regular text button
  if (isSmallButton) {
    sizeStyles = 'w-4 h-4 text-xs sm:w-7 sm:h-7';
  } else if (title.length === 1) {
    sizeStyles = 'w-7 h-7 shadow-sm-float';
  }

  return (
    <button
      onClick={!isDisabled ? onClick : null}
      className={`${sizeStyles} ${
        isDisabled
          ? 'bg-gray-300 border-white'
          : `cursor-pointer bg-${bgColor} border-gray-400`
      } font-semibold rounded-full text-${textColor} border border-${borderColor} inline-block self-center text-center`}
    >
      {title?.length <= 1 ? <p className="mt-[-2px]">{title}</p> : title}
    </button>
  );
}
