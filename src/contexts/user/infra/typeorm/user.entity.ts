import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({
    name: 'date_created',
    type: 'timestamp with time zone',
    default: () => 'now()',
  })
  dateCreated!: Date;

  @UpdateDateColumn({
    name: 'date_updated',
    type: 'timestamp with time zone',
    default: () => 'now()',
  })
  dateUpdated!: Date;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: true })
  active!: boolean;

  @Column({ default: false })
  verified!: boolean;
}
