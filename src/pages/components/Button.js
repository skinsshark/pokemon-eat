export default function Button({ title, onClick, width = 'auto' }) {
  if (width !== 'auto' && width !== 'fixed') {
    console.error('Buttons are only fixed or auto width');
    return null;
  }

  return (
    <div
      onClick={onClick}
      className={`${
        width === 'fixed' ? 'w-7 h-7' : 'px-9 py-2 text-xs'
      } font-semibold cursor-pointer rounded-full bg-white border-gray-400 border inline-block self-center text-center`}
    >
      {title}
    </div>
  );
}
