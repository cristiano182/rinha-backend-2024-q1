import { Pool } from 'pg'
import { datasource } from './config'

const load = async (pool: Pool) => {
  const conn = await pool.connect()
  await conn
    .query(
      `
    SET statement_timeout = 0;
    SET lock_timeout = 0;
    SET idle_in_transaction_session_timeout = 0;
    SET client_encoding = 'UTF8';
    SET standard_conforming_strings = on;
    SET check_function_bodies = false;
    SET xmloption = content;
    SET client_min_messages = warning;
    SET row_security = off;
    SET default_tablespace = '';
    SET default_table_access_method = heap;
    
    
    CREATE UNLOGGED TABLE IF NOT EXISTS clients (
        "id" INTEGER NOT NULL,
        "balance" INTEGER NOT NULL,
        "limite" INTEGER NOT NULL,
        "name" VARCHAR(20) NOT NULL,
        CONSTRAINT clients_pkey PRIMARY KEY (id)
    );
    
    CREATE UNLOGGED TABLE IF NOT EXISTS transactions (
        "transaction_id" SERIAL NOT NULL,
        "amount" INTEGER,
        "client_id" INTEGER NOT NULL,
        "type" CHAR(1) NOT NULL,
        "description" VARCHAR(10) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id),
        CONSTRAINT fk_client_transaction FOREIGN KEY (client_id) REFERENCES clients(id)
    );
    
    CREATE INDEX IF NOT EXISTS ixd_transactions_idcliente ON transactions(client_id ASC);
    CREATE INDEX IF NOT EXISTS idx_client_id ON clients (id);
    
    
    TRUNCATE TABLE clients, transactions CASCADE;
    
    DROP VIEW IF EXISTS view_clients_transactions;
    
    CREATE VIEW view_clients_transactions AS SELECT *
    FROM clients c, transactions t
    WHERE c.id = t.client_id;
    
    
    INSERT INTO clients ("id", "name", "balance", "limite")
    VALUES
        (1,'Phill Health', 0, 1000 * 100),
        (2,'Bill Gates',   0, 800 * 100),
        (3,'Jack Sparrol', 0, 10000 * 100),
        (4,'Luffy',        0, 100000 * 100),
        (5,'Ichigo',       0, 5000 * 100);
    
    
    INSERT INTO transactions ("amount", "client_id", "type", "description")
    VALUES
        (NULL,1, 'c', 'default'),
        (NULL,2, 'c', 'default'),
        (NULL,3, 'c', 'default'),
        (NULL,4, 'c', 'default'),
        (NULL,5, 'c', 'default');
        
        
        
      
    CREATE OR REPLACE FUNCTION credit(client_id INT, amount INT, description VARCHAR(10))
        RETURNS TABLE ( balance INT, limite INT )
        LANGUAGE plpgsql
        AS $$
        BEGIN
          PERFORM pg_advisory_xact_lock(client_id);
        
          INSERT INTO transactions  ("amount", "client_id", "type", "description")
            VALUES(amount, client_id, 'c', description);
        
          RETURN QUERY
            UPDATE clients c
            SET balance = c.balance + amount
            WHERE id = client_id
            RETURNING c.balance as client_balance, c.limite as client_limite;
        END;
        $$;
        
        
        
    
    CREATE OR REPLACE FUNCTION debit(client_id INT, amount INT, description VARCHAR(10))
        RETURNS TABLE (balance INT, error BOOL, limite INT)
        LANGUAGE plpgsql
        AS $$
        DECLARE
          client_balance int;
          client_limite int;
        BEGIN
          PERFORM pg_advisory_xact_lock(client_id);
          SELECT 
            c.limite,
            COALESCE(c.balance, 0)
          INTO
            client_limite,
            client_balance
          FROM clients c
          WHERE c.id = client_id;
        
          IF client_balance - amount >= client_limite * -1 THEN
            INSERT INTO transactions  ("amount", "client_id", "type", "description")
            VALUES(amount, client_id, 'd', description);
            
            UPDATE clients c
            SET balance = c.balance - amount
            WHERE id = client_id;
        
            RETURN QUERY
              SELECT
                c.balance as newBalance,
                FALSE,
                c.limite as clientLimite
              FROM clients c
              WHERE id = client_id;
          ELSE
            RETURN QUERY
              SELECT
                c.balance as newBalance,
                TRUE,
                c.limite as clientLimite
              FROM clients c
              WHERE id = client_id;
          END IF;
        END;
        $$;
    `,
    )
    .then(async () => {
      console.log(
        `Postgres Connected: ${datasource.connectionString} and load initial script`,
      )
    })
    .catch((e) => {
      console.log(`Postgres error occured when connecting ${e}.`)
      throw new Error(e)
    })

  conn.release()
}

export default load
