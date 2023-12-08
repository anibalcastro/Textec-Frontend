import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";
import Logo from "../../Images/Logos/Icono (1).webp";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateRepair = () => {
    const [order, setOrder] = useState({
        titulo: '',
        id_empresa: 0,
        fecha: '',
        precio: 0,
        estado: ''
    });
    const [repairDetail, setRepairDetail] = useState({
        nombre_producto: '',
        id_producto: 0,
        cantidad: 0,
        descripcion: '',
        precio_unitario: 0,
        subtotal: 0,
    });

    const [detail, setDetail] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [company, setCompany] = useState([]);
    const [products, setProducts] = useState([]);
    const [filterCompany, setFilterCompany] = useState("");
    const [dataLoad, setDataLoad] = useState(false);
    const token = Cookies.get("jwtToken");
    const role = Cookies.get("role");
    const navigate = useNavigate();

    useEffect(() => {
        alertInvalidatePermission();
        if (!dataLoad){
            fetchCompany();
            fetchProducts();
            setDataLoad(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateUserPermission = () => {
        if (role !== "Visor"){
          return true
        }
    
        return false
      }
    
      const alertInvalidatePermission = () => {
        if (!validateUserPermission()){
          Swal.fire(
            "Acceso denegado",
            "No tienes los permisos necesarios para realizar esta acción.",
            "info"
          ).then((result) => {
            if(result.isConfirmed){
              navigate("/inicio")
            }
            else{
              navigate("/inicio")
            }
          })
    
        }
    
      }

    const formatCurrencyCRC = new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
    });

    const calculateTaxAndSubt = (total) => {
        const taxRate = 13; // Tasa de impuesto (13% en este ejemplo)

        // Calcula el subtotal restando el impuesto del precio total
        const subtotal = total / (1 + taxRate / 100);

        // Calcula el impuesto
        const tax = total - subtotal;

        // Establece los valores en los estados correspondientes
        setSubtotal(subtotal.toFixed(2));
        setTax(tax.toFixed(2));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (repairDetail.cantidad <= 0 || isNaN(repairDetail.cantidad)) {
            alert("La cantidad debe ser un número positivo");
            return;
        }

        let subtotal = repairDetail.cantidad * repairDetail.precio_unitario;

        setDetail([...detail, { ...repairDetail, subtotal }]);

        subtotal += total;

        setTotal(subtotal);

        // Reinicia el estado de detalleProducto para el próximo detalle
        setRepairDetail({
            producto: '',
            cantidad: '',
            descripcion: '',
            precio_unitario: '',
            subtotal: 0,
        });

        calculateTaxAndSubt(subtotal);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setOrder({
            ...order,
            [name]: value,
        })
    };

    const handleInputChangeDetail = (event) => {
        const { name, value } = event.target;

        setRepairDetail({
            ...repairDetail,
            [name]: value,
        });
    }

    const handleInputChangeProduct = (event) => {
        const selectedProductId = event.target.value;
        // eslint-disable-next-line eqeqeq
        const selectedProduct = products.find((product) => product.id == selectedProductId);

        setRepairDetail({
            ...repairDetail,
            IdProducto: parseInt(selectedProductId),
            nombre_producto: selectedProduct.nombre_producto,
        });

    };

    /**
     * Obtener información de empresas
     */
    const fetchCompany = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch("https://api.textechsolutionscr.com/api/v1/empresas", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.hasOwnProperty("data")) {
                    const { data } = result;
                    setCompany(data);
                }
            })
            .catch((error) => console.log("error", error));
    };

    const fetchProducts = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch("https://api.textechsolutionscr.com/api/v1/productos", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.hasOwnProperty("data")) {
                    const { data } = result;
                    setProducts(data);
                }
            })
            .catch((error) => console.log("error", error));
    };

    /**
     * Get text in input (Buscar empresa)
     * @param {*} event
     */
    const handleInputChangeFilterCompany = (event) => {
        setFilterCompany(event.target.value);
    };

    /**
     * Filter company with input (Buscar empresa)
     * @returns
     */
    const filterDataCompany = () => {
        const datosFiltrados = company.filter((dato) => {
            return dato.nombre_empresa
                .toLowerCase()
                .includes(filterCompany.toLowerCase());
        });

        return datosFiltrados;
    };

    /**
     * Delete specific detail.
     * @param {*} IdProduct
     * @param {*} count
     */
    const deleteDetail = (descripcion, IdProducto, cantidad, subtotal) => {
        const updatedDetail = detail.filter(
            (item) =>
                item.descripcion !== descripcion ||
                item.IdProducto !== IdProducto ||
                item.cantidad !== cantidad
        );

        let newAmountTotal = total - subtotal;

        setTotal(newAmountTotal);
        calculateTaxAndSubt(newAmountTotal);
        setDetail(updatedDetail);
    };

    const getDate = () => {
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Agrega un 0 si el mes es de un solo dígito
        const day = String(fecha.getDate()).padStart(2, '0'); // Agrega un 0 si el día es de un solo dígito
        return `${year}-${month}-${day}`;
    }

    /**
     *
     */
    const fetchRepair = () => {
        Swal.fire({
            title: "La orden se están guardando...",
            icon: "info",
            showConfirmButton: false,
            timer: 5000, // Duración en milisegundos (5 segundos)
          });


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);


        const today = getDate();

        const reparacion = {
            titulo: order.titulo,
            id_empresa: order.id_empresa,
            fecha: today,
            precio: total,
            estado: 'Pendiente',
            comentario: order.comentario,
            detalles: detail.map((detalle) => ({
                id_producto: detalle.IdProducto,
                precio_unitario: detalle.precio_unitario,
                cantidad: detalle.cantidad,
                subtotal: detalle.subtotal,
                descripcion: detalle.descripcion
            })),
            factura: [
                {
                  id_empresa: parseInt(order.id_empresa),
                  subtotal: parseFloat(subtotal),
                  iva: parseFloat(tax),
                  monto: parseFloat(total),
                  saldo_restante: parseFloat(total),
                  comentario: 'Muchas gracias por su compra',
                  cajero: order.cajero,
                },
              ],
            };
        

        const raw = JSON.stringify({ reparacion });

        console.log(reparacion);


        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        
        fetch("https://api.textechsolutionscr.com/api/v1/reparacion/registrar", requestOptions)
            .then(response => response.json())
            .then(result => {
                const { status, error } = result;

                if (parseInt(status) === 200) {

                    let resultNotify = notify();

                    if (resultNotify){
                        Swal.fire(
                            "Reparación creada con éxito",
                            "Se ha registrado la reparacion y se ha generado una factura.",
                            "success"
                        ).then((result) => {
                            if (result.isConfirmed) {
                                navigate("/reparaciones");
                            }
                            else {
                                navigate("/reparaciones");
                            }
                        });
                    }
                }
                else {
                    let errorMessage = "";

                    for (const message of error) {
                        errorMessage += message + "\n";
                    }

                    Swal.fire("Error al crear la orden!", `${errorMessage}`, "error");
                }
            })
            .catch(error => console.log('error', error));
    };

    const returnEmailCompany = (idCompany) => {
        const data = company.find(company => company.id === idCompany);

        if (data) {
            return data.email;
        } else {
            return "anibalcastro1515@gmail.com"; // Puedes manejar el caso donde la compañía no existe
        }
    }

    const returnPhoneCompany = (idCompany) => {
        const data = company.find(company => company.id === idCompany);

        if (data) {
            return data.telefono_encargado;
        } else {
            return "85424471"; // Puedes manejar el caso donde la compañía no existe
        }
    }

    const notify = () => {
        Swal.fire({
            title: "¿Cómo desea notificar a la empresa?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "WhatsApp",
            confirmButtonColor: 'black',
            cancelButtonText: "Correo electrónico",
            showCloseButton: true,
            showCloseButtonText: "No notificar",
            showCloseButtonColor: 'black',
            reverseButtons: true,
        }).then((result) => {
            
                const mensaje =  "Estimado cliente, espero que se encuentre bien. Le informamos que la reparación a su prenda ha sido registrada en nuestro sistema. Estamos a su disposición para cualquier consulta o ajuste necesario. ¡Gracias por su preferencia!";
            
            if (result.isConfirmed) {
                // Acción si el usuario elige WhatsApp
                let phoneNumber = returnPhoneCompany(order.id_empresa);
                phoneNumber = phoneNumber.replace(/[\s-]+/g, ""); // Número de teléfono de destino
                const url = `https://api.whatsapp.com/send?phone=+506${phoneNumber}&text=${encodeURIComponent(
                    mensaje
                )}`;

                window.open(url, "_blank");
                return true

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                const email = returnEmailCompany(order.id_empresa);
                sendEmail(email, mensaje);
                return true
            }
            else if(result.dismiss === Swal.DismissReason.close){
                return true;
            }
            else{
                return true;
            }
        });
    }

    const sendEmail = (email, body) => {
        var myHeaders = new Headers();
        myHeaders.append(
            "Authorization",
            `Bearer ${token}`
        );

        var formdata = new FormData();
        formdata.append("email", email);
        formdata.append(
            "body", body
        );

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        fetch("https://api.textechsolutionscr.com/api/v1/email/notificacion", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                const { mensaje } = result;

                if (mensaje === "Correo electrónico enviado con éxito") {
                    Swal.fire(
                        "¡Email enviado con éxito!",
                        `Se ha enviado un email a ${email}!`,
                        "success"
                    );
                }
                else {
                    Swal.fire(
                        "¡Error!",
                        `Ocurrio un error al enviar el email, intente luego!`,
                        "error"
                    );
                }
            })
            .catch((error) => console.log("Error durante la petición:", error));
    }

    return (
        <React.Fragment>
            <Header title="Registrar reparación" />

            <div className="container form-contenedor">
                <form className="form-registro-clientes" onSubmit={handleSubmit}>
                    <div className="div-inp">
                        <label htmlFor="password">Titulo:</label>
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="titulo"
                            id="titulo"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="div-inp">
                        <label htmlFor="password">Teléfono:</label>
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="telefono"
                            id="telefono"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="div-inp">
                        <label htmlFor="password">Buscar empresa:</label>
                        <input
                            onChange={handleInputChangeFilterCompany}
                            type="text"
                            name="buscarEmpresa"
                            id="cedula"
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="div-inp">
                        <label htmlFor="empresa">Empresa:</label>
                        <select
                            onChange={handleInputChange}
                            name="id_empresa"
                            id="empresa"
                            required
                        >
                            <option value="">Selecciona una empresa</option>
                            {filterDataCompany().map((empresa) => (
                                <option key={empresa.id} value={empresa.id}>
                                    {empresa.nombre_empresa}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="div-inp">
                        <label htmlFor="password">Comentario:</label>
                        <textarea
                            onChange={handleInputChange}
                            id="txtArea"
                            name="comentario"
                            rows="5"
                            cols="60"
                        ></textarea>
                    </div>

                    <div className="div-inp">
                        <label htmlFor="password">Vendedor:</label>
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="cajero"
                            id="titulo"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                </form>
            </div>

            <hr className="division"></hr>

            <div className="form-contenedor">
                <form className="form-registro-clientes" onSubmit={handleSubmit}>
                    <div className="div-inp">
                        <label htmlFor="empresa">Producto:</label>
                        <select
                            onChange={handleInputChangeProduct}
                            name="producto"
                            id="producto"
                            required
                        >
                            <option value="">Selecciona un producto</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.nombre_producto}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="div-inp">
                        <label htmlFor="count">Cantidad:</label>
                        <input
                            onChange={handleInputChangeDetail}
                            type="number"
                            name="cantidad"
                            id="cantidad"
                            value={repairDetail.cantidad}
                            required
                        />
                    </div>

                    <div className="div-inp">
                        <label htmlFor="password">Descripción:</label>
                        <textarea
                            onChange={handleInputChangeDetail}
                            id="txtArea"
                            name="descripcion"
                            rows="5"
                            cols="60"
                            value={repairDetail.descripcion}
                        ></textarea>
                    </div>

                    <div className="div-inp">
                        <label htmlFor="count">Precio x reparación:</label>
                        <input
                            onChange={handleInputChangeDetail}
                            type="number"
                            name="precio_unitario"
                            id="cantidad"
                            value={repairDetail.precio_unitario}
                        />
                    </div>
                    <button className="btn-agregar-detalle">Agregar</button>
                </form>
                <div className="container img-contenedor">
                    <img className="isologo" src={Logo} alt="imagen" />
                </div>
            </div>

            <hr className="division"></hr>

            <Header title="Detalle de la reparación" />

            <table className="tabla-medidas">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Descripción</th>
                        <th>Precio total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {Array.isArray(detail) && detail.map((item) => (
                        <tr key={item.id_producto}>
                            <td>{item.nombre_producto}</td>
                            <td>{item.cantidad}</td>
                            <td>{item.descripcion}</td>
                            <td>{formatCurrencyCRC.format(item.subtotal)}</td>
                            <td>
                                <button
                                    className="btn-eliminar"
                                    onClick={() =>
                                        deleteDetail(
                                            item.descripcion,
                                            item.id_producto,
                                            item.cantidad,
                                            item.subtotal
                                        )
                                    }
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr className="division"></hr>


            <Header title="Facturación" />
            <table className="tabla-medidas">
                <thead>
                    <tr>
                        <th>Subtotal</th>
                        <th>IVA 13%</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    <td>{formatCurrencyCRC.format(subtotal)}</td>
                    <td>{formatCurrencyCRC.format(tax)}</td>
                    <td>{formatCurrencyCRC.format(total)}</td>
                </tbody>
            </table>

            <div className="container botones-contenedor">
                <button className="btn-agregar-detalle" type="submit" onClick={()=> fetchRepair()}>
                    Guardar
                </button>

            </div>
        </React.Fragment>
    );
};

export default CreateRepair;
