import React from 'react';

interface DeviceFrameProps {
    device: 'mobile' | 'tablet';
    children: React.ReactNode;
}

export default function DeviceFrame({ device, children }: DeviceFrameProps) {
    const isMobile = device === 'mobile';
    const frameClass = isMobile ? 'preview-device-mobile' : 'preview-device-tablet';

    return (
        <div className={`preview-device-shell ${frameClass}`}>
            <div className="preview-device-screen">
                <div className="preview-device-scroll no-scrollbar">
                    {children}
                </div>
            </div>
            <div className="preview-device-home" />
        </div>
    );
}
