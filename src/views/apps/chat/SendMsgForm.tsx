// ** React Imports
import { useState, SyntheticEvent, ChangeEvent } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icons Imports
import Microphone from 'mdi-material-ui/Microphone'
import Attachment from 'mdi-material-ui/Attachment'

// ** Types
import { SendMsgComponentType } from 'src/types/apps/chatTypes'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'
import UserService from 'src/services/UserService'
import MessageService from 'src/services/MessageService'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(1.25, 4),
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5)
}))

const SendMsgForm = (props: SendMsgComponentType) => {
    // ** Props
    const { store, sendMsg, chat } = props;
    const service = new MessageService();
    const serviceUsers = new UserService();

    const auth = useAuth();

    // ** State
    const [msg, setMsg] = useState<string>('')

    const handleNotify = (tipo: string) => {
      switch (tipo) {
        case "cliente-admin":
            return "cliente"
        case "cocinero-admin":
            return "cocinero"
        case "delivery-admin":
            return "delivery"

        default:
            return "";
      }
    };

    const handleSendMsg = async (e: SyntheticEvent) => {
        e.preventDefault()
        if ((msg && msg.length)) {
            let files: string[] = [];
            let newParsedMessage: any = {
                text: msg,
                status: 'entregado',
                tipo: chat.tipo,
                files: JSON.stringify(files),

                UsuarioEscritorId: auth.user?.id,
                ChatId: chat.id,
                PedidoId: chat.PedidoId,
                notificacion: handleNotify(chat.tipo)
            }

            // New normal message
            let resultSend = await service.create(newParsedMessage);

            if(resultSend.error) {
                console.log(`Error al crear mensaje: ${resultSend.mensaje}`)
            }
            // else {
                // setTimeout(() => sendMsg(), 100)
            // }
        }
        setMsg('')
    }

    const onSendFile = async (file: ChangeEvent) => {
        const reader = new FileReader()
        const { files } = file.target as HTMLInputElement
        if (files && files.length !== 0) {
            let file = files[0];
            let resultUplodad = await serviceUsers.uploadFile(file);
            if(!resultUplodad.error && resultUplodad.result) {
                let filesToUpload: any[] = [{
                    uri: resultUplodad.result,
                    name: file.name,
                    type: file.type,
                }];

                let newParsedMessage: any = {
                    text: msg,
                    status: 'pendiente',
                    files: JSON.stringify(filesToUpload),

                    UsuarioId: auth.user?.id,
                    ChatId: chat.id,
                }

                // New normal message
                // let resultSend = await service.create(newParsedMessage);

                // if(resultSend.error) {
                //     console.log(`Error al crear mensaje: ${resultSend.mensaje}`)
                // } else {
                //     setTimeout(() => sendMsg(), 100)
                // }
            }
        }
    }

  return (
        <Form onSubmit={handleSendMsg}>
            <ChatFormWrapper>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        value={msg}
                        size='small'
                        placeholder='Escribe tu mensaje aquí…'
                        onChange={e => setMsg(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-input': { pl: 0 }, '& fieldset': { border: '0 !important' } }}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* <IconButton size='small' sx={{ color: 'text.primary' }}>
                        <Microphone sx={{ fontSize: '1.375rem' }} />
                    </IconButton> */}
                    <IconButton size='small' component='label' htmlFor='upload-img' sx={{ mr: 4, color: 'text.primary' }}>
                        <Attachment sx={{ fontSize: '1.375rem' }} />
                        <input hidden type='file' id='upload-img' onChange={onSendFile}/>
                    </IconButton>
                    <Button type='submit' variant='contained'>
                        Enviar
                    </Button>
                </Box>
            </ChatFormWrapper>
        </Form>
  )
}

export default SendMsgForm
