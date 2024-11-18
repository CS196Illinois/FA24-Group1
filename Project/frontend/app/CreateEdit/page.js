import Link from 'next/link';
import styles from './create.module.css'

export default function CreateEdit() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create or Edit Person</h1>
      <div className={styles.grid}>
        <Link href="/CreateEdit/createPerson" className={styles.card}>
          <h2>Create Person</h2>
          <p>Add a new person to the database</p>
        </Link>
        <Link href="/CreateEdit/editPerson" className={styles.card}>
          <h2>Edit Person</h2>
          <p>Modify an existing person's details</p>
        </Link>
      </div>
    </div>
  );
}