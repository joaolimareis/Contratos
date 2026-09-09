"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("contratos", "arquivo_pdf", {
    type: Sequelize.STRING(500),
    allowNull: true,
    defaultValue: null,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("contratos", "arquivo_pdf");
}