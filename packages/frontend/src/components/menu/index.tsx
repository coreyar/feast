import { useState, useEffect } from 'react'
import Spinner from '../spinner'
import Strings from '../../localization/strings'
import AddItemModel from '../modal/add-item'
import { updateMenu, getMenu } from '../../services/aws'
import MenuType, { MenuOptions } from './types'
import MenuItems from './menu-items'
import Button from '../button'
import './styles.scss'

interface EditingState { toggle: boolean, category: MenuOptions | null, index: number | null }

const Menu = (): JSX.Element => {
  const [updateMenuModel, setUpdateMenuModal] = useState(false)
  const [editing, setEditing] = useState<EditingState>({ toggle: false, category: null, index: null })
  const [menu, setMenu] = useState<MenuType | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    (async () => {
      const [fetchedMenu, err] = await getMenu()
      if (err) {
        setError(err)
      } else {
        setMenu(fetchedMenu)
      }
    })()
  }, [])

  if (!menu || pending) {
    return <Spinner />
  }
  const addItem = async ({
    name, category, description, dish,
  }: { name: string, category: string, description: string, dish: string }) => {
    setPending(true)
    const state = { ...menu }
    if (editing.toggle && editing.index !== null && editing.category) {
      const originalItem = state[editing.category][editing.index]
      if (originalItem) {
        const index = state.guests.findIndex((guest) => guest === originalItem.owner)
        state.guests.splice(index, 1, name)
      }
      state[editing.category][editing.index] = { dish, description, owner: name }
    } else {
      state.guests.push(name)
      state.guests = [...Array.from(new Set(state.guests))]
      if (category) {
        state[category as MenuOptions].push({ dish, description, owner: name })
      }
    }
    const [result, err] = await updateMenu({ body: menu })
    if (result) {
      setUpdateMenuModal(false)
      setMenu(state)
    } else if (err) {
      setError(err)
    }
    setPending(false)
  }

  const deleteItem = async () => {
    setPending(true)
    const state = { ...menu }
    if (editing.toggle && editing.index !== null && editing.category) {
      state[editing.category].splice(editing.index, 1)
    }
    const [result, err] = await updateMenu({ body: menu })
    if (result) {
      setUpdateMenuModal(false)
      setMenu(state)
    } else if (err) {
      setError(err)
    }
    setPending(false)
  }

  const deleteGuest = async (index: number) => {
    setPending(true)
    const state = { ...menu }
    state.guests.splice(index, 1)
    const [result, err] = await updateMenu({ body: menu })
    if (result) {
      setMenu(state)
      setEditing({ toggle: false, category: null, index: null })
    } else if (err) {
      setError(err)
    }
    setPending(false)
  }

  const onSelectEditing = ({ category, index }: { category: MenuOptions, index: number }) => {
    setEditing({ toggle: true, category, index })
    setUpdateMenuModal(true)
  }

  const hasAppetizer = menu[MenuOptions.appetizer].length > 0
  const hasEntre = menu[MenuOptions.entre].length > 0
  const hasDesserts = menu[MenuOptions.dessert].length > 0
  const hasDrinks = menu[MenuOptions.drinks].length > 0
  const hasSides = menu[MenuOptions.side].length > 0
  const hasGuests = menu.guests.length > 0
  return (
    <div className="component__menu">
      {error ? <div className="error">{Strings.errors.updating}</div> : null}
      {!hasAppetizer && !hasEntre && !hasDesserts && !hasDrinks && !hasSides && <p>{Strings.nothingOnTheMenuYet}</p>}
      <MenuItems items={menu[MenuOptions.appetizer]} editing={editing.toggle} category={MenuOptions.appetizer} onSelect={onSelectEditing} />
      <MenuItems items={menu[MenuOptions.entre]} editing={editing.toggle} category={MenuOptions.entre} onSelect={onSelectEditing} />
      <MenuItems items={menu[MenuOptions.side]} editing={editing.toggle} category={MenuOptions.side} onSelect={onSelectEditing} />
      <MenuItems items={menu[MenuOptions.dessert]} editing={editing.toggle} category={MenuOptions.dessert} onSelect={onSelectEditing} />
      <MenuItems items={menu[MenuOptions.drinks]} editing={editing.toggle} category={MenuOptions.drinks} onSelect={onSelectEditing} />
      {hasGuests ? (
        <div className="component__guests">
          <h2>{Strings.guests}</h2>
          {menu.guests.map((guest, index) => (
            <div className="guest" key={guest}>
              <h3>{guest}</h3>
              {editing.toggle ? <img className="icon" src="/images/delete.png" alt="Delete Guest" onClick={() => deleteGuest(index)} /> : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="buttons">
        {!editing.toggle ? <Button onClick={() => setUpdateMenuModal(true)}>{Strings.signup}</Button> : null}
        <Button
          onClick={() => setEditing({ ...editing, toggle: !editing.toggle })}
          className="edit"
        >
          {editing.toggle ? Strings.cancel : Strings.edit}
        </Button>
      </div>
      <AddItemModel
        visible={updateMenuModel}
        close={() => setUpdateMenuModal(false)}
        addItem={addItem}
        deleteItem={deleteItem}
        item={editing.index !== null && editing.category && editing.toggle ? menu[editing.category][editing.index] : null}
        category={editing.category}
      />
    </div>
  )
}

export default Menu
