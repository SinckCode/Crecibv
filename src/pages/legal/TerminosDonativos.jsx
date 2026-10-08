import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import LegalLayout from './LegalLayout';
import { LEGAL_LAST_UPDATED } from './constants';

/**
 * Terminos y condiciones de donativos.
 *
 * BORRADOR TECNICO: redactado a partir de los medios de donativo que el
 * sitio ofrece de forma real. Debe ser revisado por el asesor legal de
 * CRECIBV antes de considerarse definitivo. Los puntos sobre emision de
 * CFDI conviene validarlos ademas con el contador de la asociacion.
 */
const TerminosDonativos = () => {
  const { settings } = useSiteSettings();
  const { orgInfo } = settings;

  return (
    <LegalLayout title="Términos y Condiciones de Donativos" lastUpdated={LEGAL_LAST_UPDATED}>
      <h2>1. Quiénes somos</h2>
      <div className="legal-page__card">
        <p>
          <strong>{orgInfo.fullName}</strong>
        </p>
        <p>RFC: CCR1902216I1</p>
        <p>Domicilio: {orgInfo.address.full}</p>
        <p>Teléfono: {orgInfo.phone}</p>
        <p>Correo electrónico: {orgInfo.email}</p>
      </div>
      <p>
        CRECIBV es una asociación civil sin fines de lucro dedicada a la atención educativa y la
        rehabilitación de personas con discapacidad visual y baja visión en León, Guanajuato.
      </p>
      <p>
        Estos términos aplican a cualquier donativo que usted realice a favor de CRECIBV a través de
        los medios publicados en este sitio.
      </p>

      <h2>2. Naturaleza del donativo</h2>
      <p>
        Todo donativo es <strong>voluntario, gratuito e irrevocable</strong>. No constituye una
        compraventa ni una contratación de servicios, y no genera a favor del donante ninguna
        contraprestación, producto, servicio, membresía ni derecho sobre la asociación o sobre sus
        decisiones.
      </p>
      <p>
        Esto no es una formalidad: para que un donativo sea deducible, la legislación fiscal exige
        que sea <strong>no oneroso y no remunerativo</strong>, es decir, que el donante no reciba
        nada a cambio.
      </p>
      <p>
        <strong>Sobre el agradecimiento público.</strong> CRECIBV puede mencionar a una persona o
        empresa donante en sus informes, en su sitio o en sus redes sociales, siempre con el
        consentimiento previo de quien donó. Cuando lo hace, esa mención es un{' '}
        <strong>agradecimiento que la asociación decide libremente</strong> y no forma parte de
        ningún acuerdo: no es publicidad contratada, no constituye contraprestación por el donativo,
        no obliga a CRECIBV a difundir nada ni durante ningún plazo, y no otorga al donante derecho
        alguno sobre la imagen, el nombre o las marcas de la asociación.
      </p>
      <p>
        CRECIBV <strong>no vende espacios publicitarios ni presta servicios de promoción</strong>.
        Si lo que usted busca es exposición de marca a cambio de un pago, eso es un patrocinio: es
        una figura distinta, con otro tratamiento fiscal y otro comprobante, y debe tratarse por
        separado y no como donativo.
      </p>

      <h2>3. Medios para donar</h2>
      <ul>
        <li>
          <strong>Transferencia bancaria</strong> a la cuenta CLABE publicada en la sección de
          donativos de este sitio
        </li>
        <li>
          <strong>Plataformas de recaudación en línea</strong> enlazadas desde este sitio
        </li>
        <li>
          <strong>Contacto directo</strong> por teléfono o WhatsApp al {orgInfo.phone}
        </li>
      </ul>
      <p>
        Las plataformas de recaudación en línea son operadas por terceros ajenos a CRECIBV. Al
        utilizarlas, usted queda sujeto a los términos, comisiones y políticas de privacidad de cada
        plataforma. CRECIBV no controla esos servicios ni responde por ellos, y recibe únicamente el
        importe neto que la plataforma le transfiere una vez descontadas sus comisiones.
      </p>
      <p>
        CRECIBV nunca le solicitará contraseñas, números completos de tarjeta ni claves de acceso
        bancario por teléfono, correo o mensajería.
      </p>

      <h2>4. Destino de los donativos</h2>
      <p>
        Los donativos se destinan íntegramente al cumplimiento del objeto social de la asociación,
        que comprende, de forma enunciativa:
      </p>
      <ul>
        <li>Enseñanza del sistema Braille</li>
        <li>Educación básica adaptada en los niveles preescolar, primaria y secundaria</li>
        <li>Orientación y movilidad, incluido el uso del bastón blanco</li>
        <li>Computación y tiflotecnología</li>
        <li>Atención psicológica y habilidades de la vida diaria</li>
        <li>Traslado de beneficiarios entre su domicilio y la asociación</li>
        <li>Los gastos de operación necesarios para sostener los servicios anteriores</li>
      </ul>
      <p>
        Conforme a los términos de su autorización, los donativos deducibles que CRECIBV recibe se
        destinan <strong>exclusivamente y en su totalidad</strong> a las actividades asistenciales
        comprendidas en el objeto social por el cual fue autorizada.
      </p>
      <p>
        Salvo acuerdo previo y por escrito que destine un donativo a un fin específico, CRECIBV
        asignará los recursos al área de mayor necesidad según el criterio de su órgano de gobierno.
      </p>

      <h2>5. Devoluciones</h2>
      <p>
        Por su naturaleza, los donativos no son reembolsables. Si usted identifica un error evidente
        —por ejemplo un cargo duplicado o un monto distinto al que pretendía donar— puede
        escribirnos a {orgInfo.email} dentro de los treinta días naturales siguientes a la
        operación, y analizaremos el caso de buena fe.
      </p>

      <h2>6. Comprobante fiscal</h2>
      <p>
        CRECIBV cuenta con autorización vigente para recibir donativos deducibles. La emisión del
        comprobante fiscal digital por internet (CFDI) está sujeta a que:
      </p>
      <ul>
        <li>El donante lo solicite de forma expresa</li>
        <li>Proporcione sus datos fiscales completos y vigentes</li>
        <li>El medio de pago utilizado permita identificar el origen del donativo</li>
      </ul>
      <p>
        <strong>
          Los donativos recibidos a través de plataformas externas pueden no ser identificables de
          forma individual, por lo que en esos casos puede no ser posible emitir el comprobante.
        </strong>{' '}
        Si usted requiere comprobante fiscal, le recomendamos comunicarse con nosotros{' '}
        <strong>antes</strong> de donar, al {orgInfo.phone} o a {orgInfo.email}, para indicarle el
        medio adecuado.
      </p>
      <h3>Lo que conviene saber antes de transferir</h3>
      <p>
        Estos requisitos los fija la legislación fiscal, no CRECIBV, y conocerlos de antemano evita
        la situación más incómoda posible: un donativo ya hecho que no se puede deducir.
      </p>
      <ul>
        <li>
          <strong>Todo donativo superior a $2,000 debe pagarse por medio bancario</strong>
          —transferencia, cheque nominativo, tarjeta de crédito o débito— para ser deducible.{' '}
          <strong>Los donativos en efectivo no son deducibles.</strong>
        </li>
        <li>
          <strong>La operación y el comprobante deben quedar dentro del ejercicio fiscal</strong>{' '}
          que usted pretende deducir. Un donativo de diciembre cuyo comprobante se emite en enero no
          se deduce en el ejercicio que cerró.
        </li>
        <li>
          <strong>Hay un límite a lo deducible.</strong> Tratándose de personas morales, el 7% de la
          utilidad fiscal del ejercicio inmediato anterior. Tratándose de personas físicas, el 7% de
          los ingresos acumulables del ejercicio anterior, cantidad que además queda comprendida
          dentro del límite global de las deducciones personales, junto con gastos médicos,
          colegiaturas e intereses hipotecarios, entre otros.
        </li>
      </ul>
      <p>
        Lo anterior es orientación general y no asesoría fiscal. Su situación particular —régimen,
        topes aplicables y efecto real de la deducción— debe confirmarla con su contador. Puede
        además verificar nuestra autorización vigente consultando el RFC{' '}
        <strong>CCR1902216I1</strong> en el directorio de donatarias autorizadas del Servicio de
        Administración Tributaria.
      </p>

      <h2>7. Transparencia</h2>
      <p>
        Como organización autorizada para recibir donativos deducibles, CRECIBV está obligada a
        presentar cada año, en el mes de mayo y respecto del ejercicio anterior, la{' '}
        <strong>
          declaración informativa de transparencia del patrimonio y del uso y destino de los
          donativos recibidos
        </strong>
        , además de la declaración anual informativa de ingresos y egresos propia del régimen de
        personas morales con fines no lucrativos.
      </p>
      <p>
        No son trámites menores: el cumplimiento de esas obligaciones es lo que mantiene vigente la
        autorización para expedir comprobantes deducibles, y su incumplimiento la hace perder.
      </p>
      <p>
        Cualquier donante puede solicitar información sobre la aplicación de los recursos
        escribiendo a {orgInfo.email}.
      </p>

      <h2>8. Uso de imagen y testimonios</h2>
      <p>
        CRECIBV no publica imágenes, nombres ni información de sus beneficiarios sin el
        consentimiento previo y por escrito de la persona interesada o, tratándose de menores de
        edad, de quien ejerza la patria potestad o la tutela.
      </p>
      <p>
        Realizar un donativo no otorga al donante ningún derecho sobre la imagen, los datos o la
        historia personal de los beneficiarios.
      </p>

      <h2>9. Datos personales</h2>
      <p>
        El tratamiento de los datos personales que usted nos proporcione se rige por nuestro{' '}
        <Link to="/aviso-de-privacidad">Aviso de Privacidad</Link>.
      </p>

      <h2>10. Modificaciones</h2>
      <p>
        CRECIBV puede modificar estos términos en cualquier momento. La versión vigente será siempre
        la publicada en esta página, con su fecha de última actualización. Los cambios no afectan
        donativos ya realizados.
      </p>

      <h2>11. Legislación aplicable</h2>
      <p>
        Para la interpretación y cumplimiento de estos términos, resultan aplicables las leyes de
        los Estados Unidos Mexicanos. Cualquier controversia se someterá a la jurisdicción de los
        tribunales competentes de la ciudad de León, Guanajuato, renunciando las partes a cualquier
        otro fuero que pudiera corresponderles.
      </p>

      <h2>12. Contacto</h2>
      <p>
        Para cualquier duda sobre estos términos o sobre su donativo, escríbanos a {orgInfo.email} o
        llámenos al {orgInfo.phone}, en horario de {orgInfo.hours}.
      </p>
    </LegalLayout>
  );
};

export default TerminosDonativos;
