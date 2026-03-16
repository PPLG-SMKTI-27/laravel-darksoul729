const fs = require('fs');

const file = '/home/panzek/project-menuju-sukses/laravel-darksoul729/resources/js/components/IntroOverlay.jsx';
let content = fs.readFileSync(file, 'utf-8');

const newPortal = `const CinematicPortal = ({ state }) => {
    // state: 'solid' | 'opening' | 'flying'
    
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-10">
            {/* The white background that covers everything initially */}
            <motion.div 
                className="absolute inset-0 bg-white"
                animate={{ opacity: state === 'solid' ? 1 : 0 }}
                transition={{ duration: 0.1 }}
            />

            {/* The Portal Hole */}
            <motion.div
                initial={false}
                animate={{
                    width: state === 'solid' ? '0px' : '250px',
                    height: state === 'solid' ? '0px' : '250px',
                    scale: state === 'flying' ? 80 : 1,
                    opacity: state === 'solid' ? 0 : 1,
                }}
                transition={{
                    width: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
                    height: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
                    scale: { duration: 2.2, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: 0.1 }
                }}
                style={{
                    borderRadius: '50%',
                    boxShadow: '0 0 0 200vmax #ffffff', // The solid white mask around the hole
                    background: 'transparent',
                    willChange: 'transform, width, height',
                    transformOrigin: 'center center'
                }}
            />
            
            {/* Inner lens ring for extra cinematic depth */}
            <motion.div
                className="absolute border-[1.5px] border-slate-200"
                animate={{ 
                    width: state === 'solid' ? '0px' : '250px',
                    height: state === 'solid' ? '0px' : '250px',
                    scale: state === 'flying' ? 80 : 1,
                    opacity: state === 'solid' ? 0 : state === 'opening' ? 1 : 0,
                }}
                transition={{
                    width: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
                    height: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
                    scale: { duration: 2.2, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: state === 'flying' ? 1.0 : 0.3 }
                }}
                style={{
                    borderRadius: '50%',
                    willChange: 'transform, width, height',
                    transformOrigin: 'center center'
                }}
            />
        </div>
    );
};`;

content = content.replace(/const CinematicPortal = \(\{ state \}\) \=\> \{[\s\S]*?\}\;\n\};\n/g, newPortal + "\n");

fs.writeFileSync(file, content);
console.log('updated');
