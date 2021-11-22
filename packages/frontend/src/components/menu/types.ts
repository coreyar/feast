export enum MenuOptions {
  appetizer = 'appetizer',
  side = 'side',
  entre = 'entre',
  dessert = 'dessert',
  drinks = 'drinks',

}

export interface Item {
  dish: string,
  description: string,
  owner: string,
}

interface MenuType {
  guests: string[],
  [MenuOptions.appetizer]: Item[],
  [MenuOptions.side]: Item[],
  [MenuOptions.entre]: Item[],
  [MenuOptions.dessert]: Item[],
  [MenuOptions.drinks]: Item[],
}

export default MenuType
