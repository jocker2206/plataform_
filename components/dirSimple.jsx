import React, { } from 'react';
import { formatBytes } from '../services/utils';

const DirSimple = ({ name = 'Nueva Carpeta', fileCount = 0, size = 0  }) => {

    // render
    return (
        <div className="card p-1">
            <div className="media align-items-center">
                <h1 className="mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="feather feather-folder icon-inline"
                    >
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                </h1>
                <div className="media-body ml-1">
                    <h6 className="mb-0">
                        <a href="javascript:void(0)" className="stretched-link text-body font-size-sm">
                            {name || ""}
                        </a>
                    </h6>
                    <small className="text-muted float-left">{fileCount} {fileCount > 1 ? 'Archivos' : 'Archivo'}, {formatBytes(size)}</small>
                </div>
            </div>
        </div>
    )
}

// exportar 
export default DirSimple;