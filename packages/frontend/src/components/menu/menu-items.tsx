import Strings from '../../localization/strings'
import { MenuOptions, Item } from './types'
import './styles.scss'

interface Props {
  category: MenuOptions,
  items: Item[],
  editing: boolean,
  onSelect: (data: { category: MenuOptions, index: number }) => void
}

const MenuItems = ({
  category, items, editing, onSelect,
}: Props): JSX.Element | null => {
  if (items.length > 0) {
    return (
      <div>
        <h2>{Strings[category]}</h2>
        {items.map(({ dish, description, owner }, index) => (
          <div className="dish">
            {editing ? <img className="icon" src="/images/pencil.png" alt="Open Edit Modal" onClick={() => onSelect({ category, index })} /> : null}
            <h3>{dish}</h3>
            <p>{description}</p>
            <p>{`${Strings.preparedBy} ${owner}`}</p>
            <hr />
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default MenuItems
