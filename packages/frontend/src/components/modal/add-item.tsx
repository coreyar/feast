import { useState } from 'react'
import Modal from './modal'
import Button from '../button'
import Input from '../input'
import Select from '../select'
import Strings from '../../localization/strings'
import { MenuOptions, Item } from '../menu/types'
import './styles.scss'

interface FormProps {
  deleteItem: () => void,
  onSubmit: (data: { name: string, category: string, dish: string, description: string }) => void
  item: Item | null,
  category: MenuOptions | null
}

const Form = ({
  onSubmit, item, category: defaultCategory, deleteItem,
}: FormProps): JSX.Element => {
  const [name, setName] = useState(item?.owner || '')
  const [category, setCategory] = useState(defaultCategory || '')
  const [dish, setDish] = useState(item?.dish || '')
  const [description, setDescription] = useState(item?.description || '')
  const options = [
    { value: '', label: Strings.nope },
    { value: MenuOptions.appetizer, label: Strings.appetizer },
    { value: MenuOptions.entre, label: Strings.entre },
    { value: MenuOptions.dessert, label: Strings.dessert },
    { value: MenuOptions.side, label: Strings.side },
    { value: MenuOptions.drinks, label: Strings.drinks },
  ]
  const onSubmitWrapped = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      name, category, dish, description,
    })
  }
  const nameError = !name && Strings.errors.name
  const dishError = !dish && Strings.errors.dish
  const dishDescriptionError = !description && Strings.errors.description
  return (
    <form onSubmit={onSubmitWrapped}>
      <Input name="name" label="Name*" value={name} onChange={setName} key="name" error={nameError} />
      <Select name="category" options={options} label={Strings.bringAnything} value={category} onChange={setCategory} />
      {category ? <Input name="dish" label="Dish" type="text" value={dish} onChange={setDish} error={dishError} /> : null}
      {category
        ? <Input name="description" label="Description" type="text" value={description} onChange={setDescription} error={dishDescriptionError} />
        : null}
      <div className="modal-footer">
        <Button disabled={!!(nameError || (category && (dishError || dishDescriptionError)))} type="submit">{Strings.save}</Button>
        {item ? <Button onClick={() => deleteItem()}>{Strings.delete}</Button> : null }
      </div>
    </form>
  )
}

interface AddItemProps {
  visible: boolean,
  close: () => void,
  addItem: (data: { name: string, category: string, dish: string, description: string }) => void,
  item: Item | null,
  category: MenuOptions | null,
  deleteItem: () => void,
}

const AddItem = ({
  visible, close, addItem, item, category, deleteItem,
}: AddItemProps): JSX.Element | null => {
  if (visible) {
    return (
      <Modal close={close} key="modal">
        <Form onSubmit={addItem} item={item} category={category} deleteItem={deleteItem} />
      </Modal>
    )
  }
  return null
}

export default AddItem
