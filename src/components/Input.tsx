import { ChangeEvent, ReactNode } from 'react'
import { EmojiInput } from './Input/EmojiInput'
import { SmsCodeInput } from './Input/SmsCodeInput'
import cs from 'classnames'
import {DateInput} from './Input/DateInput'

type Props = {
  label?: string | ReactNode
  placeholder?: string
  value?: string
  _onChange?: (value: string) => void
  error?: string
  disableError?:boolean
  className?:string
}&(
  | { type?: 'text' }
  | { type: 'emoji' }
  | { type: 'date' }
  | { type: 'sms_code' ; request:() => Promise<unknown>}
  | { type: 'select'; options: { value: string; text: string }[] }
)
export const Input: React.FC<Props> = (props) => {
  const { label, placeholder, type, value, _onChange, error,disableError,className} = props
  const onChange = (e:string|ChangeEvent<HTMLInputElement| HTMLSelectElement>) => {
    if(typeof e === 'string'){
      _onChange?.(e)
    }else{
      _onChange?.(e.target.value)

    }
  }
  const common = {value, onChange, placeholder}
  const renderInput = () => {
    switch (props.type) {//变成了props里的type
      case undefined:
      case 'text':
        return <input  j-input-text type='text' {...common}/>
      case 'emoji':
        return <EmojiInput  {...common} />
        case 'sms_code':
          return (
            <SmsCodeInput   {...common}/>
          )
          case 'select':
            return <select   {...common}
              className={cs(className, "h-36px")}>
              {props.options.map(option =>
                <option  key={option.value}  value={option.value}>{option.text}</option>)
              }
            </select>
            case 'date':
              return <DateInput {...common}/>
      default:
        return null
    }
  }
  return (
    <>
      <div flex flex-col gap-y-8px className={className}>
      {label ? <span text-18px>{label}</span> : null}
        {renderInput()}
      {disableError ? null :<span text-red text-12px>{error || ' '}</span>}
      </div>
    </>
  )
}