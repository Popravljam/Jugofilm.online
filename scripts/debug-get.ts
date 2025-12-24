import 'dotenv/config';
import { getMovieFullById } from '../lib/queries';

const id = Number(process.argv[2] || '0');
const m = getMovieFullById(id);
console.log({ id, found: !!m, title: m?.title, runtime: m?.runtime });
