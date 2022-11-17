import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { FaTrashAlt } from "react-icons/fa"
import './deleteDeckButton.css'

interface DeleteDeckButtonProps {
  deleteDeckFunction: (deckName: string) => void,
  deckName: string
}

export function DeleteDeckButton({ deleteDeckFunction, deckName }: DeleteDeckButtonProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button onClick={()=>{navigator.vibrate(50)}} className="trashButton">
          <FaTrashAlt />
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AlertDialogContent">
          <AlertDialog.Title className="AlertDialogTitle">Are you sure?</AlertDialog.Title>
          <AlertDialog.Description className="AlertDialogDescription">
            This will delete your deck and it's informations.
          </AlertDialog.Description>
          <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild>
              <button className="cancelButton">Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button onClick={() => { deleteDeckFunction(deckName) }} className="confirmButton">Delete Deck</button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}