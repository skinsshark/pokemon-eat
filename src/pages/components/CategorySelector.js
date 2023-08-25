import { CURRY, SALADS, DESSERTS } from '../../helpers/utils';

export default function CategorySelector({ category, setCategory }) {
  return (
    <ul className="flex justify-between px-3">
      <Category
        title={CURRY}
        selectedCategory={category}
        setCategory={setCategory}
      />
      <Category
        title={SALADS}
        selectedCategory={category}
        setCategory={setCategory}
      />
      <Category
        title={DESSERTS}
        selectedCategory={category}
        setCategory={setCategory}
      />
    </ul>
  );
}

const Category = ({ title, selectedCategory, setCategory }) => {
  const isSelected = title === selectedCategory;
  return (
    <li
      className={`py-1.5 xl:py-2 px-1 border-b-2 text-md xl:text-lg font-bold w-1/3 text-center cursor-pointer inline-block ${
        isSelected
          ? 'text-orange-400 border-b-orange-400'
          : 'text-gray-600 border-b-gray-300'
      }`}
      onClick={() => setCategory(title)}
    >
      {title.charAt(0) + title.toLowerCase().slice(1)}
    </li>
  );
};
