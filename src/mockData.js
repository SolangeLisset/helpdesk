export const technicians = [
  { id: 'tec-1', name: 'Camila Torres', specialty: 'Redes' },
  { id: 'tec-2', name: 'Diego Fuentes', specialty: 'Soporte Nivel 2' },
  { id: 'tec-3', name: 'Valentina Rios', specialty: 'Seguridad' }
];

export const users = [
  { id: 'usr-1', name: 'Paula Admin', email: 'paula.admin@empresa.cl', role: 'Administrador' },
  { id: 'usr-2', name: 'Diego Tecnico', email: 'diego.tecnico@empresa.cl', role: 'Tecnico' },
  { id: 'usr-3', name: 'Marcos Usuario', email: 'marcos.usuario@empresa.cl', role: 'Usuario' }
];

export const seedTickets = [
  {
    id: 'HD-0100',
    title: 'VPN corporativa no conecta',
    description:
      'El usuario no puede acceder a la VPN desde fuera de la oficina. El error aparece despues de validar MFA.',
    category: 'Red',
    priority: 'Alta',
    status: 'En progreso',
    assignee: 'Camila Torres',
    requester: 'Marcos Usuario',
    requesterEmail: 'marcos.usuario@empresa.cl',
    createdAt: '2026-06-09T11:20:00.000Z',
    attachments: [
      { name: 'error-vpn.png', size: '184 KB', url: '#' },
      { name: 'diagnostico-red.txt', size: '12 KB', url: '#' }
    ],
    comments: [
      {
        author: 'Marcos Usuario',
        role: 'Usuario',
        body: 'Adjunto captura del error. Necesito conectarme para aprobar facturas hoy.',
        at: '2026-06-09T11:24:00.000Z'
      },
      {
        author: 'Camila Torres',
        role: 'Tecnico',
        body: 'Se reviso el perfil VPN. Estoy regenerando la configuracion y validando politicas MFA.',
        at: '2026-06-09T12:05:00.000Z'
      }
    ]
  },
  {
    id: 'HD-0099',
    title: 'Notebook con disco casi lleno',
    description:
      'Equipo del area comercial presenta lentitud y alertas de almacenamiento disponible menor al 5%.',
    category: 'Hardware',
    priority: 'Media',
    status: 'Pendiente',
    assignee: 'Diego Fuentes',
    requester: 'Andrea Molina',
    requesterEmail: 'andrea.molina@empresa.cl',
    createdAt: '2026-06-08T15:35:00.000Z',
    attachments: [{ name: 'inventario-equipo.pdf', size: '92 KB', url: '#' }],
    comments: [
      {
        author: 'Diego Fuentes',
        role: 'Tecnico',
        body: 'Se agenda limpieza remota y respaldo de archivos temporales.',
        at: '2026-06-08T16:10:00.000Z'
      }
    ]
  },
  {
    id: 'HD-0098',
    title: 'Solicitud de acceso a CRM',
    description: 'Nueva ejecutiva requiere acceso al CRM con perfil de ventas zona centro.',
    category: 'Accesos',
    priority: 'Baja',
    status: 'Resuelto',
    assignee: 'Valentina Rios',
    requester: 'Javier Soto',
    requesterEmail: 'javier.soto@empresa.cl',
    createdAt: '2026-06-07T13:00:00.000Z',
    attachments: [{ name: 'aprobacion-jefatura.msg', size: '28 KB', url: '#' }],
    comments: [
      {
        author: 'Valentina Rios',
        role: 'Tecnico',
        body: 'Acceso creado con rol de ventas. Se envio correo de bienvenida.',
        at: '2026-06-07T14:45:00.000Z'
      }
    ]
  },
  {
    id: 'HD-0097',
    title: 'Alerta EDR en equipo financiero',
    description:
      'Consola de seguridad reporta comportamiento anomalo en estacion de trabajo del area financiera.',
    category: 'Seguridad',
    priority: 'Alta',
    status: 'Abierto',
    assignee: 'Valentina Rios',
    requester: 'SOC Empresa',
    requesterEmail: 'soc@empresa.cl',
    createdAt: '2026-06-09T09:10:00.000Z',
    attachments: [{ name: 'reporte-edr.csv', size: '44 KB', url: '#' }],
    comments: [
      {
        author: 'SOC Empresa',
        role: 'Administrador',
        body: 'Se solicita contencion y analisis inicial antes de liberar el equipo.',
        at: '2026-06-09T09:15:00.000Z'
      }
    ]
  }
];
