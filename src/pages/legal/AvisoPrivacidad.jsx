import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import LegalLayout from './LegalLayout';
import { LEGAL_LAST_UPDATED } from './constants';

/**
 * Aviso de privacidad integral.
 *
 * BORRADOR TECNICO: redactado a partir del tratamiento de datos que este
 * sitio realiza de forma real (formulario de contacto y analitica web).
 * Debe ser revisado por el asesor legal de CRECIBV antes de considerarse
 * definitivo.
 *
 * Los datos de identificacion se leen de siteSettings para que no se
 * desincronicen con el resto del sitio si cambia el domicilio o el correo.
 */
const AvisoPrivacidad = () => {
  const { settings } = useSiteSettings();
  const { orgInfo } = settings;

  return (
    <LegalLayout title="Aviso de Privacidad" lastUpdated={LEGAL_LAST_UPDATED}>
      <h2>1. Responsable del tratamiento de sus datos personales</h2>
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
        En adelante <strong>CRECIBV</strong>, es responsable del uso y protección de sus datos
        personales, y al respecto le informa lo siguiente.
      </p>

      <h2>2. Qué datos personales recabamos</h2>
      <p>A través de este sitio web recabamos únicamente los siguientes datos:</p>
      <ul>
        <li>Nombre completo</li>
        <li>Correo electrónico</li>
        <li>El contenido del mensaje que usted redacte</li>
      </ul>
      <p>
        Estos datos se recaban <strong>solo cuando usted completa de forma voluntaria</strong> el
        formulario de contacto.
      </p>
      <p>
        <strong>No solicitamos a través de este sitio</strong> datos financieros o patrimoniales,
        números de tarjeta, contraseñas, ni datos personales sensibles. Si usted decide realizar un
        donativo, la operación ocurre fuera de este sitio: por transferencia desde su propia
        institución bancaria o en la plataforma de recaudación que corresponda.
      </p>
      <p>
        Si además nos solicita su comprobante fiscal, necesitaremos algunos datos fiscales que
        tampoco se piden por este sitio. Lo que se recaba en ese caso, para qué y por cuánto tiempo
        se conserva está detallado en la sección 8,{' '}
        <em>Datos de las personas y empresas que donan</em>.
      </p>

      <h2>3. Para qué usamos sus datos</h2>
      <h3>Finalidades necesarias</h3>
      <ul>
        <li>Responder su mensaje y dar seguimiento a su solicitud</li>
        <li>
          Atender consultas sobre nuestros servicios, sobre cómo donar o sobre participación
          voluntaria
        </li>
        <li>Llevar un registro interno de las comunicaciones recibidas</li>
      </ul>
      <h3>Finalidades adicionales</h3>
      <ul>
        <li>Enviarle información sobre actividades, campañas y resultados de la asociación</li>
      </ul>
      <p>
        Si no desea que sus datos se utilicen para las finalidades adicionales, puede indicarlo en
        su propio mensaje o escribirnos a {orgInfo.email}. Su negativa no será motivo para negarle
        ningún servicio.
      </p>

      <h2>4. Cookies y tecnologías de rastreo</h2>
      <p>
        Este sitio utiliza <strong>Google Analytics</strong>, un servicio de análisis web que coloca
        cookies en su navegador para medir cómo se usa el sitio: páginas visitadas, tiempo de
        permanencia, tipo de dispositivo y ubicación aproximada de la visita a nivel de ciudad o
        región.
      </p>
      <p>
        Esta información es estadística y no lo identifica a usted por nombre. La utilizamos
        únicamente para entender qué contenido resulta útil y mejorar el sitio.
      </p>
      <p>
        <strong>
          Esta medición no se activa sola: Google Analytics no se carga hasta que usted lo acepta en
          el aviso que aparece al pie de la página.
        </strong>{' '}
        Si lo rechaza, o mientras no haya decidido, no se instala ninguna cookie de análisis y no se
        mide nada. Su decisión se guarda en su propio navegador para no volver a preguntársela en
        cada visita.
      </p>
      <p>
        Además puede deshabilitar las cookies desde la configuración de su navegador o instalar el
        complemento de inhabilitación de Google Analytics. Nada de esto afecta el funcionamiento del
        sitio ni su posibilidad de contactarnos o donar.
      </p>

      <h2>5. Con quién compartimos sus datos</h2>
      <p>
        <strong>
          CRECIBV no vende, no renta y no comercializa los datos personales de ninguna persona.
        </strong>
      </p>
      <p>
        Para operar este sitio utilizamos servicios de Google (Firebase y Google Analytics). Esto
        implica que la información se almacena y procesa en servidores que pueden ubicarse fuera de
        territorio mexicano. Estos proveedores actúan como encargados del tratamiento por cuenta de
        CRECIBV y están obligados a proteger la información conforme a sus propios compromisos de
        privacidad.
      </p>
      <p>
        Fuera de lo anterior, no transferimos sus datos a terceros, salvo requerimiento fundado y
        motivado de autoridad competente.
      </p>

      <h2>6. Cómo protegemos su información</h2>
      <p>
        Los mensajes enviados desde este sitio se almacenan con acceso restringido y únicamente
        pueden ser consultados por el personal administrativo autorizado de CRECIBV. El sitio opera
        sobre conexión cifrada (HTTPS).
      </p>

      <h2>7. Sus derechos ARCO</h2>
      <p>
        Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los usamos y
        las condiciones del uso que les damos (<strong>Acceso</strong>). También a solicitar la
        corrección de su información cuando esté desactualizada o sea inexacta (
        <strong>Rectificación</strong>); a pedir que la eliminemos de nuestros registros cuando
        considere que no se está utilizando conforme a lo aquí descrito (
        <strong>Cancelación</strong>); y a oponerse al uso de sus datos para fines específicos (
        <strong>Oposición</strong>). Asimismo, puede revocar en cualquier momento el consentimiento
        que nos haya otorgado.
      </p>
      <p>Para ejercer cualquiera de estos derechos, envíe su solicitud a {orgInfo.email} con:</p>
      <ul>
        <li>Su nombre y un medio para comunicarle la respuesta</li>
        <li>Copia de una identificación oficial que acredite su identidad</li>
        <li>Descripción clara de los datos y del derecho que desea ejercer</li>
      </ul>
      <p>
        Daremos respuesta en un plazo máximo de veinte días hábiles contados a partir de la
        recepción de su solicitud. También puede presentarla de forma presencial en{' '}
        {orgInfo.address.full}, en horario de {orgInfo.hours}.
      </p>

      <h2>8. Datos de las personas y empresas que donan</h2>
      <p>
        Cuando usted realiza un donativo y solicita su comprobante fiscal, necesitamos tratar datos
        que no se recaban por este sitio, sino por correo, teléfono, WhatsApp o en nuestras
        instalaciones:
      </p>
      <ul>
        <li>Nombre completo o razón social</li>
        <li>RFC y régimen fiscal</li>
        <li>Domicilio fiscal y código postal</li>
        <li>Constancia de Situación Fiscal, cuando usted nos la proporciona</li>
        <li>Correo electrónico y teléfono</li>
        <li>Monto, fecha y medio de pago del donativo</li>
      </ul>
      <p>Estos datos se utilizan únicamente para:</p>
      <ul>
        <li>
          Emitir el comprobante fiscal digital por internet (CFDI) con el complemento de donatarias
          que exige la autoridad fiscal
        </li>
        <li>
          Cumplir las obligaciones de registro, contabilidad e información que la legislación fiscal
          impone a las organizaciones autorizadas para recibir donativos deducibles
        </li>
        <li>Agradecer su aportación e informarle sobre el destino de los recursos</li>
      </ul>
      <p>
        <strong>Sobre la conservación y un límite que conviene conocer.</strong> La información que
        respalda un donativo y su comprobante fiscal debe conservarse durante el plazo que fija la
        legislación fiscal, que es más largo del que aplicaríamos por nuestra propia cuenta. Por esa
        razón, mientras subsista esa obligación legal, no podemos cancelar ni suprimir los registros
        contables y fiscales de un donativo ya realizado, aun cuando usted lo solicite. Sus derechos
        de acceso, rectificación y oposición siguen vigentes, y la limitación alcanza solo a lo que
        la ley nos obliga a conservar.
      </p>
      <p>
        <strong>No difundimos el nombre de ningún donante sin su autorización.</strong> Si en algún
        momento CRECIBV agradece públicamente una aportación, lo hace únicamente con el
        consentimiento previo de la persona o empresa donante, y ese agradecimiento no constituye
        una contraprestación por el donativo.
      </p>

      <h2>9. Datos de nuestros beneficiarios</h2>
      <p>
        El tratamiento de la información de las personas que reciben nuestros servicios educativos y
        de rehabilitación no se rige por este aviso, sino por uno específico que se entrega
        directamente en nuestras instalaciones al momento de la inscripción, junto con la carta de
        consentimiento para el uso de imagen cuando corresponde.
      </p>
      <p>
        CRECIBV no publica imágenes, nombres ni información de sus beneficiarios sin el
        consentimiento previo y por escrito de la persona interesada o, tratándose de menores de
        edad, de quien ejerza la patria potestad o la tutela.
      </p>

      <h2>10. Cambios a este aviso de privacidad</h2>
      <p>
        Cualquier modificación a este aviso se publicará en esta misma página, indicando la fecha de
        última actualización. Le sugerimos consultarla periódicamente.
      </p>

      <h2>11. Consentimiento</h2>
      <p>
        Al enviar el formulario de contacto de este sitio, usted manifiesta que ha leído este aviso
        de privacidad y consiente el tratamiento de sus datos personales en los términos aquí
        descritos.
      </p>
      <p>
        Si su consulta se relaciona con un donativo, le recomendamos revisar también nuestros{' '}
        <Link to="/terminos">Términos y Condiciones de Donativos</Link>.
      </p>
    </LegalLayout>
  );
};

export default AvisoPrivacidad;
