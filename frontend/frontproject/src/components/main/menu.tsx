import styles from '../../assets/css/menu.module.css'
const Menu = (props: any) => {
  console.log(props.setModalIsOpen)
  return (
    <div className={props.setModalIsOpen ? styles.openModal : styles.modal}>
      {props.setModalIsOpen ? (
        <>
          <div
            onClick={() => {
              props.setModalIsOpen(false)
              console.log(props.setModalIsOpen)
            }}
          >
            x
          </div>
          <div>this is modal</div>
        </>
      ) : null}
    </div>
  )
}
export default Menu
