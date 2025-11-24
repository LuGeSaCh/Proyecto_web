import React, { useState } from 'react';
import './AccordionItem.css';

/**
 * Componente reutilizable para un elemento de acordeon (pregunta/respuesta).
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - titulo del acordeon.
 * @param {React.ReactNode} props.children - El contenido a mostrar/ocultar.
 */
function AccordionItem({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion-item">
            <button
                className={`accordion-title ${isOpen ? 'open' : ''}`}
                onClick={toggleAccordion}
                aria-expanded={isOpen}
            >
                <span className="title-text">{title}</span>
                {/* Ícono de flecha que rota con el estado */}
                <span className="accordion-icon">
                    {/* Usamos un triangulo simple */}
                    &#9660;
                </span>
            </button>
            {/* Contenido que se expande/contrae */}
            <div className={`accordion-content-wrapper ${isOpen ? 'open' : ''}`}>
                <div className="accordion-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AccordionItem;