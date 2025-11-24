import React from "react";
// Importamos el nuevo componente
import AccordionItem from "../components/AccordionItem.jsx";
import "./HelpPage.css";

function HelpPage() {
    // Definimos la lista de Preguntas Frecuentes
    const faqs = [
        {
            // --- NUEVA PREGUNTA: Reservas y modificaciones ---
            question: "¡Ayuda! Necesito modificar o cancelar mi reserva de auto.",
            answer: (
                <div>
                    <h3>Reservas y modificaciones</h3>
                    <p>
                        Puedes modificar o cancelar tu reserva comunicándote con nosotros por **WhatsApp, teléfono o correo electrónico**, indicando tu número de reserva.
                    </p>
                    <p>
                        Los cambios están sujetos a **disponibilidad y a la política de cambios/cancelaciones vigente**; en algunos casos puede aplicarse un cargo si se hace muy cerca de la fecha de recogida.
                    </p>
                </div>
            ),
        },
        {
            question: "¿Cómo puedo rentar un carro en Rentados?",
            answer: (
                <div>
                    <h3>Renta de carro </h3>
                    <p>
                        Debes elegir fechas, horas y sucursal de recogida y devolución, seleccionar el tipo de vehículo y completar tus datos personales.
                    </p>
                    <p>
                        Al final, confirmas la reserva con el método de pago disponible y recibirás un correo con la confirmación y los detalles de tu renta.
                    </p>
                </div>
            ),
        },
        {
            question: "¿Qué formas de pago aceptan para la renta de autos?",
            answer: (
                <div>
                    <h3>Formas de Pago </h3>
                    <p>
                        Generalmente, el conductor principal debe tener al menos 25 años. Algunos vehículos o propietarios pueden permitir conductores más jóvenes (21-24) con una tarifa adicional. Por favor, revisa los detalles específicos de cada anuncio.
                    </p>
                    <p>
                        Para el depósito de garantía se requiere una tarjeta de crédito a nombre del titular de la reserva.
                    </p>
                </div>
            ),
        },
        {
            question: "¿Se solicita depósito o bloqueo en mi tarjeta de crédito al recoger el auto?",
            answer: (
                <div>
                    <h3>Información del deposito</h3>
                    <p>
                        Sí. Al momento de la recogida se realiza un bloqueo (depósito de garantía) en tu tarjeta de crédito.
                        Este monto se libera al devolver el auto en buen estado y cumpliendo las condiciones del contrato (combustible, horario, multas, etc.).
                    </p>
                </div>
            ),
        },
        {
            question: "¿Cuáles son los requisitos de edad para rentar un auto?",
            answer: (
                <div>
                    <h3>Requisito de edad</h3>
                    <p>
                        La edad mínima estándar suele ser de 21 años, con al menos 1 año de tener licencia de conducir.
                        Para conductores más jóvenes puede aplicarse un cargo adicional y algunas categorías de vehículos exigen más edad.
                    </p>
                </div>
            ),
        },
        {
            question: "¿Qué documentos necesito presentar al momento de la recogida?",
            answer: (
                <div>
                    <h3>Documentos a presentar a la hora de recoger</h3>
                    <p>
                        Debes presentar tu licencia de conducir vigente, tu documento de identidad o pasaporte y una tarjeta de crédito a nombre del titular de la reserva.
                        Los conductores adicionales también deben mostrar su licencia original.
                    </p>
                </div>
            ),
        },
        {
            question: "¿El precio que aparece en la página incluye todos los impuestos y cargos?",
            answer: (
                <div>
                    <h3>Lo que incluye nuestros precios </h3>
                    <p>
                        El precio mostrado incluye la tarifa base y los impuestos obligatorios indicados en el resumen de la reserva.
                        Algunos servicios opcionales (seguros adicionales, conductores extra, sillas para bebé, entrega fuera de horario, etc.) pueden tener un costo extra que se detalla antes de confirmar la reserva
                    </p>
                </div>
            ),
        },
        {
            question: "¿Qué tipos de seguros o coberturas ofrecen para el auto?",
            answer: (
                <div>
                    <h3>Seguros para el carro </h3>
                    <p>
                        Ofrecemos coberturas que incluyen daños a terceros y, según el plan, daños al vehículo y robo.
                        Puedes agregar coberturas opcionales para reducir o eliminar deducibles y ampliar la protección en caso de accidente.
                    </p>
                </div>
            ),
        },
        {
            question: "¿Qué debo hacer en caso de accidente, robo o avería del vehículo?",
            answer: (
                <div>
                    <h3>Instrcciones en caso de accidente/robo/avería del carro</h3>
                    <p>
                        Comunícate de inmediato con nosotros al número de emergencia indicado en tu contrato y sigue las instrucciones del personal.
                        En caso de accidente, si es posible y seguro, no muevas el vehículo, espera a las autoridades y completa el reporte correspondiente.
                    </p>
                </div>
            ),
        },
        {
            question: "¿Dónde y a qué hora puedo recoger y devolver el auto?",
            answer: (
                <div>
                    <h3>Instrcciones de donde y a que hora recoger/devolver el carro</h3>
                    <p>
                        La recogida y devolución se realizan en las sucursales y horarios seleccionados durante la reserva.
                        En algunas oficinas es posible coordinar servicio fuera de horario con costo adicional, siempre que se acuerde previamente.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2>Preguntas Frecuentes</h2>

            <div className="accordion-list">
                {faqs.map((item, index) => (
                    <AccordionItem key={index} title={item.question}>
                        {item.answer}
                    </AccordionItem>
                ))}
            </div>

            <h2>Contáctanos</h2>
            <p>
                Si tienes alguna pregunta que no está cubierta en nuestra sección de preguntas frecuentes, no dudes en contactarnos directamente. Nuestro equipo de soporte estará encantado de asistirte lo antes posible.
            </p>
            <p>Email: <a href="mailto:soporte@rentados.com">soporte@rentados.com</a></p>
        </div>
    );
}

export default HelpPage;