
import fs from 'fs';
import path from 'path';
import { https } from 'follow-redirects';

const galleryDir = path.join(process.cwd(), 'public', 'gallery');

const images = [
    { name: 'fosstar-event-1.jpg', keywords: 'tech,meetup,india' },
    { name: 'fosstar-summit.jpg', keywords: 'conference,speaker,leadership' },
    { name: 'fosserve-launch.jpg', keywords: 'government,launch,india' },
    { name: 'fossync-club.jpg', keywords: 'students,computer,lab,india' },
    { name: 'fosstorm-workshop.jpg', keywords: 'coding,workshop,collaboration' },
    { name: 'fossart-startup.jpg', keywords: 'startup,office,team' },
    { name: 'fossterage-database.jpg', keywords: 'server,data,visualization' },
    { name: 'fosspeaks-advocacy.jpg', keywords: 'seminar,discussion,people' },
];

if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true });
}

async function downloadImage(filename: string, keywords: string) {
    const file = fs.createWriteStream(path.join(galleryDir, filename));
    const url = `https://source.unsplash.com/800x600/?${keywords}`;

    console.log(`Downloading ${filename} from ${url}...`);

    return new Promise<void>((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Follow redirect manually if needed, though 'follow-redirects' usually handles it.
                // source.unsplash.com redirects to images.unsplash.com
                // Let's rely on the library or just use the location header if simple https get fails.
                // Actually, built-in https doesn't follow redirects automatically.
                // Let's use a simpler approach with fetch if available in Bun/Node context
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`✅ ${filename} downloaded.`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(path.join(galleryDir, filename), () => { });
            console.error(`Error downloading ${filename}: ${err.message}`);
            reject(err);
        });
    });
}

// Bun has built-in fetch which is much better
async function downloadWithBun() {
    console.log("Starting download of gallery images...");

    for (const img of images) {
        try {
            const url = `https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80`; // Fallback/Generic tech image if search fails
            // Actually, let's use specific IDs to ensure we get different images
            // I will use a map of specific IDs for better results

            let specificUrl = "";
            switch (img.name) {
                case 'fosstar-event-1.jpg': specificUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"; break;
                case 'fosstar-summit.jpg': specificUrl = "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800"; break;
                case 'fosserve-launch.jpg': specificUrl = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800"; break;
                case 'fossync-club.jpg': specificUrl = "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800"; break;
                case 'fosstorm-workshop.jpg': specificUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"; break;
                case 'fossart-startup.jpg': specificUrl = "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800"; break;
                case 'fossterage-database.jpg': specificUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"; break;
                case 'fosspeaks-advocacy.jpg': specificUrl = "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800"; break;
                default: specificUrl = `https://source.unsplash.com/800x600/?${img.keywords}`;
            }

            console.log(`Downloading ${img.name}...`);
            const response = await fetch(specificUrl);
            if (!response.ok) throw new Error(`Failed to fetch ${specificUrl}: ${response.statusText}`);

            const buffer = await response.arrayBuffer();
            fs.writeFileSync(path.join(galleryDir, img.name), Buffer.from(buffer));
            console.log(`✅ Saved ${img.name}`);
        } catch (error) {
            console.error(`❌ Failed to download ${img.name}:`, error);
        }
    }
    console.log("Download complete!");
}

downloadWithBun();
