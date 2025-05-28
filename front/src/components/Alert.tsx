import React from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  if (!message) {
    return null;
  }

  let alertClasses = "relative p-4 mb-4 border rounded-lg text-sm";
  const iconContainerClasses = "flex items-center";
  let iconSvgPath = "";
  let iconSrText = "";
  const closeButtonBaseClasses = "absolute top-3 right-3 -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8";
  let closeButtonSpecificClasses = "";

  if (type === 'error') {
    alertClasses += " text-red-800 bg-red-50 border-red-300 dark:bg-gray-800 dark:text-red-400 dark:border-red-800";
    iconSvgPath = "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"; 
    iconSrText = "Erro";
    closeButtonSpecificClasses = "bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-100 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700";
  } else { 
    alertClasses += " text-green-800 bg-green-50 border-green-300 dark:bg-gray-800 dark:text-green-400 dark:border-green-800";
    iconSvgPath = "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"; 
    iconSrText = "Sucesso";
    closeButtonSpecificClasses = "bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-100 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700";
  }

  return (
    <div className={alertClasses} role="alert">
      <div className={iconContainerClasses}>
        <svg
          aria-hidden="true"
          className="flex-shrink-0 inline w-5 h-5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fillRule="evenodd" d={iconSvgPath} clipRule="evenodd"></path>
        </svg>
        <span className="sr-only">{iconSrText}</span>
        <div>
          {message}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          className={`${closeButtonBaseClasses} ${closeButtonSpecificClasses}`}
          onClick={onClose}
          aria-label="Fechar"
        >
          <span className="sr-only">Fechar</span>
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
};