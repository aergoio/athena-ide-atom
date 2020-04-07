Contract
========

You can deploy/execute/query smart contract. Deploying and executing is done by making transaction. Make sure that you have enough aergo token to make transaction before deploying and executing contract.

Compile
-------

Before deploying contract, you have to compile by **clicking compile button** or **pressing F7**.

.. image:: ../_static/img/compile-contract-before.png

.. image:: ../_static/img/compile-contract-after.png

Deploy
------

After compiling contract, you can deploy contract.

Without args
^^^^^^^^^^^^

You can deploy contract without constructor arguments.

.. code-block:: lua

  -- no arguments
  function constructor()
    system.setItem("k1", "v1")
  end

  ...

.. image:: ../_static/img/deploy-without-args.png

With args
^^^^^^^^^

You can deploy contract with constructor arguments.

.. code-block:: lua

  -- arguments (key, value)
  function constructor(key, value)
    system.setItem(key, value)
  end

  ...

.. image:: ../_static/img/deploy-with-args.png

Gas limit
^^^^^^^^^

You can deploy contract with gas limit configuration. 0 limit means infinite (uses as much as possible).

.. image:: ../_static/img/deploy-with-gas-limit.png

Amount
^^^^^^

You can deploy contract with aergo token. Make sure constructor is registered as payable.

.. code-block:: lua

  function constructor()
    system.setItem("k1", "v1")
  end

  ...

  -- registered as payable
  abi.payable(constructor)

.. image:: ../_static/img/deploy-with-amount.png

Import & Remove
---------------

Import
^^^^^^

You can import already deployed contract. 

Type contract address & click import button

.. image:: ../_static/img/import-contract-enter.png

Contract imported

.. image:: ../_static/img/import-contract-result.png

Remove
^^^^^^

You can remove contract.

Click trash button

.. image:: ../_static/img/remove-contract-before.png

Contract removed

.. image:: ../_static/img/remove-contract-after.png

Execute
-------

Contract execution can change status of contract state db. Any function registered as register can be executed.

Without args
^^^^^^^^^^^^

You can execute contract without arguments.

.. code-block:: lua

  ...

  -- no arguments
  function setDefault()
    system.setItem("k1", "v1")
  end

  ...

  -- register as execution
  abi.register(setDefault)

.. image:: ../_static/img/execute-without-args.png

With args
^^^^^^^^^

You can execute contract with arguments.

.. code-block:: lua

  ...

  -- arguments (key, value)
  function set(key, value)
    system.setItem(key, value)
  end

  ...

  -- register as execution
  abi.register(set)

.. image:: ../_static/img/execute-with-args.png

Gas limit
^^^^^^^^^

You can execute contract with configuring gas limit.  0 limit means infinite (uses as much as possible).

.. image:: ../_static/img/execute-with-gas-limit.png

Amount
^^^^^^

You can execute contract with aergo token. Make sure function is registered as payable.

.. code-block:: lua

  ...

  function run()
  end

  ...

  -- registered as payable
  abi.payable(run)

.. image:: ../_static/img/execute-with-amount.png

Fee delegation
^^^^^^^^^^^^^^

You can execute contract with fee delegation. When contract is executed with fee delegation, the contract pays fee on behalf of contract executor. Make sure function is registered as fee_delegation and a contract has enough aergo token.

.. code-block:: lua

  ...

  function run()
  end

  -- registered as fee delegation
  abi.fee_delegation(run)

  -- register as execution
  abi.register(run)

.. image:: ../_static/img/execute-with-fee-delegation.png

Query
-----

Contract query can check status of contract state db. Any function registered in register_view can be invoked as query.

Without args
^^^^^^^^^^^^

You can query contract status without arguments.

.. code-block:: lua

  ...

  -- no arguments
  function getDefault()
    return system.getItem("k1")
  end

  -- registered as register_view
  abi.register_view(getDefault)

.. image:: ../_static/img/query-without-args.png

.. image:: ../_static/img/query-result.png

With args
^^^^^^^^^

You can query contract status with arguments.

.. code-block:: lua

  ...

  -- arguments (key)
  function get(key)
    return system.getItem(key)
  end

  -- registered as register_view
  abi.register_view(get)

.. image:: ../_static/img/query-with-args.png

.. image:: ../_static/img/query-result.png

Varargs
-------

Lua supports varargs. The varargs is denoted by ... in argument.

.. code-block:: lua

  ...

  -- ... : varargs
  function set(key, ...)
    local s = ""
    for i,v in ipairs{...} do
      s = s .. v
    end
    system.setItem(key, s)
  end

  ...

  abi.register(set)

Add
^^^

Click **+** button

.. image:: ../_static/img/varargs-add-before.png

Argument added

.. image:: ../_static/img/varargs-add-after.png

Remove
^^^^^^

Click **-** button

.. image:: ../_static/img/varargs-remove-before.png

Argument removed

.. image:: ../_static/img/varargs-remove-after.png

Redeploy (private mode only)
----------------------------

You can redeploy already deployed contract. This is supported in a private mode only. Make sure redeployer account is deployer of already deployed one.

To redeploy contract, select deployed contract and click deploy button.

.. image:: ../_static/img/redeploy-contract-selected.png