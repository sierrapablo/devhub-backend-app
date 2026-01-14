import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'status' })
export class StatusEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({
    name: 'date',
    type: 'timestamp with time zone',
    default: () => 'now()',
  })
  date!: Date;

  @Column({ default: false })
  status!: boolean;
}
