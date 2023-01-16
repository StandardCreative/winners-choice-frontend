import { Formik } from "formik"
import { validateAddr } from "../utils/utils"
import WCFactoryFormInner from "./WCFactoryFormInner"

const validate = (values) => {
  console.log("validate")
  const errors = {}
  return errors
  if (!values.whitelist) {
    errors.whitelist = "Required"
  } else errors.whitelist = validateAddr(values.whitelist)

  //now need to remove properties of errors for which there were no errors,
  //otherwise formik won't submit the form (can't leave them even if they are undefined)
  Object.keys(errors).forEach((k) => !errors[k] && delete errors[k])
  return errors
}

export const WCFactoryForm = ({ onSubmit, account, nftAddr, logs, uiMode }) => {
  const WCFactoryFormInitVals = {
    whitelist:  account ? (account + ", " + account) : "", //same in useEffect in inner comp
    nftAddr: nftAddr,
    unlockInterval: "2",
  }

  return (
    <>
      <Formik
        initialValues={WCFactoryFormInitVals}
        validate={validate}
        onSubmit={(values, actions) => {
          console.log("submitting")
          onSubmit(values)
          actions.setSubmitting(false)
        }}
      >
        {/* https://stackoverflow.com/questions/66235334/formik-setfieldvalue-inside-a-function */}
        <WCFactoryFormInner account={account} nftAddr={nftAddr} logs={logs} uiMode={uiMode}/>
      </Formik>
    </>
  )
}
