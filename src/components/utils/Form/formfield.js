import React from 'react'

const formfield = ({formData, change, id}) => {

  const renderTemplate = () => {
    let formTemplate = null;

    switch(formData.element){
      case('input'):
        formTemplate
      break;
      default:
        formTemplate = null;
    }

    return formTemplate;
  }

  return (
    <div>
      {renderTemplate()}
    </div>
  )
}

export default formfield
